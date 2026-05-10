abstract class BaseError extends Error {}

class DomainError extends BaseError {}

class UseCaseError extends BaseError {}

class PresentationError extends BaseError {}

class InfrastructureError extends BaseError {}
