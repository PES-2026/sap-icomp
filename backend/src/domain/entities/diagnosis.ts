import { Result } from "@domain/shared/result";
import { AcronymVO } from "@domain/valueObjects/shared/acronym";
import { CidVO } from "@domain/valueObjects/diagnoses/cid";
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";
import { NameVO } from "@domain/valueObjects/shared/name";

export type DiagnosisProps = {
  id?: string;
  name: string;
  acronym?: string;
  cid?: string;
};

export type DiagnosisPropsVO = {
  name: NameVO;
  acronym: AcronymVO;
  cid: CidVO;
};

export class Diagnosis {
  constructor(
    public readonly diagnosisId: ExternalIdVO,
    public name: NameVO,
    public acronym?: AcronymVO,
    public cid?: CidVO,
  ) {}

  static create(props: DiagnosisProps): Result<Diagnosis> {
    const id = ExternalIdVO.create();
    const name = NameVO.create(props.name);
    const acronym = props.acronym ? AcronymVO.create(props.acronym) : undefined;
    const cid = props.cid ? CidVO.create(props.cid) : undefined;

    const results = [id, name, acronym, cid];

    for (const result of results) {
      if (result?.isFailure) {
        return Result.fail<Diagnosis>(result.error!);
      }
    }

    return Result.ok<Diagnosis>(
      new Diagnosis(
        id.getValue(),
        name.getValue(),
        acronym ? acronym.getValue() : undefined,
        cid ? cid.getValue() : undefined,
      ),
    );
  }

  static rehydrate(props: DiagnosisProps): Diagnosis {
    return new Diagnosis(
      ExternalIdVO.fromTrusted(props.id!),
      NameVO.fromTrusted(props.name),
      props.acronym ? AcronymVO.fromTrusted(props.acronym) : undefined,
      props.cid ? CidVO.fromTrusted(props.cid) : undefined,
    );
  }

  update(props: Partial<DiagnosisPropsVO>): void {
    if (props.name !== undefined) this.name = props.name;
    if (props.acronym !== undefined) this.acronym = props.acronym;
    if (props.cid !== undefined) this.cid = props.cid;
  }
}
