/* eslint-disable no-undef */
describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });

  it("should navigate to tuesday", () => {
    cy.visit("/");
    /*    cy.get('li.day-list__item')
      .should('contain', 'Tuesday')
    cy.contains("li", 'Tuesday')
      .click()
      .should("have.css", "background-color", "rgb(242, 242, 242)") */
    cy.contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
  });
});
