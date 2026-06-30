import { Result } from "@domain/shared/result";
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";

import { ConclusionVO } from "../valueObjects/report/conclusion";
import { ConditionVO } from "../valueObjects/report/condition";
import { RecommendationVO } from "../valueObjects/report/recommendation";
import { DifficultiesVO } from "../valueObjects/student/difficulties";
import { PotentialVO } from "../valueObjects/student/potential";

type ReportProps = {
  id?: string;
  studentId: string;
  pedagogueId: string;
  condition: string;
  potential: string;
  difficulties: string;
  recommendation: string;
  conclusion: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Report {
  constructor(
    public readonly id: ExternalIdVO,
    public readonly studentId: ExternalIdVO,
    public readonly pedagogueId: ExternalIdVO,
    public condition: ConditionVO,
    public potential: PotentialVO,
    public difficulties: DifficultiesVO,
    public recommendation: RecommendationVO,
    public conclusion: ConclusionVO,
    public status?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  update(
    condition: string,
    potential: string,
    difficulties: string,
    recommendation: string,
    conclusion: string,
  ): Result<void> {
    const conditionVO = ConditionVO.create(condition);
    const potentialVO = PotentialVO.create(potential);
    const difficultiesVO = DifficultiesVO.create(difficulties);
    const recommendationVO = RecommendationVO.create(recommendation);
    const conclusionVO = ConclusionVO.create(conclusion);

    const results = [conditionVO, potentialVO, difficultiesVO, recommendationVO, conclusionVO];

    for (const result of results) {
      if (result.isFailure) {
        return Result.fail<void>(result.error!);
      }
    }

    this.condition = conditionVO.getValue();
    this.potential = potentialVO.getValue();
    this.difficulties = difficultiesVO.getValue();
    this.recommendation = recommendationVO.getValue();
    this.conclusion = conclusionVO.getValue();

    return Result.ok<void>();
  }

  static create(props: ReportProps): Result<Report> {
    const externalId = ExternalIdVO.create();
    const studentId = ExternalIdVO.from(props.studentId);
    const pedagogueId = ExternalIdVO.from(props.pedagogueId);
    const condition = ConditionVO.create(props.condition);
    const potential = PotentialVO.create(props.potential);
    const difficulties = DifficultiesVO.create(props.difficulties);
    const recommendation = RecommendationVO.create(props.recommendation);
    const conclusion = ConclusionVO.create(props.conclusion);

    const results = [
      externalId,
      studentId,
      pedagogueId,
      condition,
      potential,
      difficulties,
      recommendation,
      conclusion,
    ];

    for (const result of results) {
      if (result.isFailure) {
        return Result.fail<Report>(result.error!);
      }
    }

    return Result.ok<Report>(
      new Report(
        externalId.getValue(),
        studentId.getValue(),
        pedagogueId.getValue(),
        condition.getValue(),
        potential.getValue(),
        difficulties.getValue(),
        recommendation.getValue(),
        conclusion.getValue(),
        props.status,
      ),
    );
  }

  static rehydrate(props: ReportProps): Report {
    return new Report(
      ExternalIdVO.fromTrusted(props.id!),
      ExternalIdVO.fromTrusted(props.studentId),
      ExternalIdVO.fromTrusted(props.pedagogueId),
      ConditionVO.fromTrusted(props.condition),
      PotentialVO.fromTrusted(props.potential),
      DifficultiesVO.fromTrusted(props.difficulties),
      RecommendationVO.fromTrusted(props.recommendation),
      ConclusionVO.fromTrusted(props.conclusion),
      props.status,
      props.createdAt,
      props.updatedAt,
    );
  }
}
