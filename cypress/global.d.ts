declare namespace Cypress {
  export interface Chainable {
    task(
      event: "db:reset",
      arg: { force: boolean },
      options?: Partial<Loggable & Timeoutable>
    ): Chainable<boolean>;

    task(
      event: "factory",
      arg: { name: string; values: any },
      options?: Partial<Loggable & Timeoutable>
    ): Chainable<any>;

    login({ email: string, password: string }): Chainable<Response>;
  }
}
