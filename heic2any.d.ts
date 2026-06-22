// Déclaration de types pour heic2any (la lib publie un bundle UMD sans .d.ts).
declare module "heic2any" {
  export interface Heic2AnyOptions {
    blob: Blob;
    toType?: string;
    quality?: number;
    multiple?: boolean;
    gifInterval?: number;
  }
  export default function heic2any(
    options: Heic2AnyOptions,
  ): Promise<Blob | Blob[]>;
}
