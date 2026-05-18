import { Result } from "@domain/shared/result";
import { AcronymVO } from "@domain/valueObjects/shared/acronym";

import { CourseName } from "../valueObjects/course/courseName";
import { ExternalIdVO } from "../valueObjects/shared/externalId";

export type CourseProps = {
  courseId?: string;
  name: string;
  acronym: string;
  coordinatorId: string;
};

export type CoursePropsVO = {
  name: CourseName;
  acronym: AcronymVO;
  coordinatorId?: ExternalIdVO;
};

export class Course {
  constructor(
    public readonly externalId: ExternalIdVO,
    public name: CourseName,
    public acronym: AcronymVO,
    public coordinatorId?: ExternalIdVO,
  ) {}

  static create(props: CourseProps): Result<Course> {
    const externalId = ExternalIdVO.create();
    const courseName = CourseName.create(props.name);
    const courseAcronym = AcronymVO.create(props.acronym);
    const courseCoordinatorId = props.coordinatorId ? ExternalIdVO.from(props.coordinatorId) : undefined;

    const results = [externalId, courseName, courseAcronym, courseCoordinatorId];

    for (const result of results) {
      if (result?.isFailure) {
        return Result.fail<Course>(result.error!);
      }
    }

    return Result.ok<Course>(
      new Course(
        externalId.getValue(),
        courseName.getValue(),
        courseAcronym.getValue(),
        courseCoordinatorId?.getValue() ?? undefined,
      ),
    );
  }

  static rehydrate(props: CourseProps): Course {
    return new Course(
      ExternalIdVO.fromTrusted(props.courseId!),
      CourseName.fromTrusted(props.name),
      AcronymVO.fromTrusted(props.acronym),
      ExternalIdVO.fromTrusted(props.coordinatorId),
    );
  }

  update(props: Partial<CoursePropsVO>): void {
    if (props.name !== undefined) this.name = props.name;
    if (props.acronym !== undefined) this.acronym = props.acronym;
    if (props.coordinatorId !== undefined) this.coordinatorId = props.coordinatorId;
  }
}
