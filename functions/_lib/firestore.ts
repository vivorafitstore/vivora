import { getGoogleAccessToken } from "./google-auth";

// Conversão entre o formato "Value" do Firestore (usado pela REST API) e
// objetos JS simples. A REST API exige esse formato tipado em vez de JSON
// puro — ver https://firebase.google.com/docs/firestore/reference/rest/v1/Value

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { mapValue: { fields: Record<string, FirestoreValue> } }
  | { arrayValue: { values: FirestoreValue[] } };

export function toFirestoreValue(v: unknown): FirestoreValue {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") {
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  }
  if (Array.isArray(v)) {
    return { arrayValue: { values: v.map(toFirestoreValue) } };
  }
  if (typeof v === "object") {
    const fields: Record<string, FirestoreValue> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (val !== undefined) fields[k] = toFirestoreValue(val);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(v) };
}

export function fromFirestoreValue(v: FirestoreValue): unknown {
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("nullValue" in v) return null;
  if ("mapValue" in v) {
    const obj: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v.mapValue.fields ?? {})) {
      obj[k] = fromFirestoreValue(val as FirestoreValue);
    }
    return obj;
  }
  if ("arrayValue" in v) {
    return (v.arrayValue.values ?? []).map(fromFirestoreValue);
  }
  return null;
}

export function docToObject(doc: {
  name: string;
  fields: Record<string, FirestoreValue>;
}): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(doc.fields ?? {})) {
    obj[k] = fromFirestoreValue(v);
  }
  obj.id = doc.name.split("/").pop();
  return obj;
}

interface FirestoreClientOptions {
  projectId: string;
  serviceAccountJson: string;
}

export class FirestoreClient {
  private projectId: string;
  private serviceAccountJson: string;
  private baseUrl: string;

  constructor({ projectId, serviceAccountJson }: FirestoreClientOptions) {
    this.projectId = projectId;
    this.serviceAccountJson = serviceAccountJson;
    this.baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
  }

  private async authHeader() {
    const token = await getGoogleAccessToken(this.serviceAccountJson);
    return { Authorization: `Bearer ${token}` };
  }

  async createDocument(
    collection: string,
    data: Record<string, unknown>,
    documentId?: string
  ): Promise<Record<string, unknown>> {
    const fields: Record<string, FirestoreValue> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) fields[k] = toFirestoreValue(v);
    }

    const url = documentId
      ? `${this.baseUrl}/${collection}?documentId=${encodeURIComponent(documentId)}`
      : `${this.baseUrl}/${collection}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await this.authHeader()),
      },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      throw new Error(`Firestore createDocument falhou: ${res.status} ${await res.text()}`);
    }

    return docToObject(await res.json());
  }

  async getDocument(collection: string, id: string): Promise<Record<string, unknown> | null> {
    const res = await fetch(`${this.baseUrl}/${collection}/${id}`, {
      headers: await this.authHeader(),
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`Firestore getDocument falhou: ${res.status} ${await res.text()}`);
    }
    return docToObject(await res.json());
  }

  async updateDocument(
    collection: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const fields: Record<string, FirestoreValue> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) fields[k] = toFirestoreValue(v);
    }

    const mask = Object.keys(data)
      .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
      .join("&");

    const res = await fetch(`${this.baseUrl}/${collection}/${id}?${mask}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(await this.authHeader()),
      },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      throw new Error(`Firestore updateDocument falhou: ${res.status} ${await res.text()}`);
    }

    return docToObject(await res.json());
  }

  /** Busca o primeiro documento de uma coleção cuja propriedade `field` == `value`. */
  async findOneWhere(
    collection: string,
    field: string,
    value: string
  ): Promise<Record<string, unknown> | null> {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents:runQuery`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await this.authHeader()),
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: collection }],
            where: {
              fieldFilter: {
                field: { fieldPath: field },
                op: "EQUAL",
                value: toFirestoreValue(value),
              },
            },
            limit: 1,
          },
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Firestore runQuery falhou: ${res.status} ${await res.text()}`);
    }

    const results = (await res.json()) as { document?: { name: string; fields: Record<string, FirestoreValue> } }[];
    const found = results.find((r) => r.document);
    return found?.document ? docToObject(found.document) : null;
  }
}
