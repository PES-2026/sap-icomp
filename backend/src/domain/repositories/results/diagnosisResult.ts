import { BaseItem } from "@domain/shared/item";

export interface DiagnosisResult extends BaseItem {
  name: string;
  acronym: string;
  cid: string;
}
