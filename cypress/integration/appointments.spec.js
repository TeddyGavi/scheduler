/* eslint-disable no-undef */
describe("Booking an Interview", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("Monday");
  });
  it("Should add an student and select an interviewer, book the appointment and reduce the days remaining by one", () => {
    cy.get("[alt=Add]").first().click();
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains("Save").click();
    /*
    
    if we just use the cy.contains I noticed the second selector begins from the start of the DOM so it grabs the first appointment container, using contains after a get, it seems it selects a single appointment card which matches the two criteria  
    
    */
    cy.get(".schedule > :nth-child(2)")
      .contains(".appointment__card--show", "Lydia Miller-Jones")
      .contains(".appointment__card--show", "Sylvia Palmer");
    cy.contains("[data-testid=day]", "Monday").contains("no spots remaining");
  });
  it("Should edit an interview", () => {
    cy.get("[alt=Edit]").first().click({ force: true });
    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Lydia Miller-Jones");
    cy.get("[alt='Tori Malcolm']").click();
    cy.contains("Save").click();
    cy.get(".schedule > :nth-child(1)")
      .contains(".appointment__card--show", "Lydia Miller-Jones")
      .contains(".appointment__card--show", "Tori Malcolm");
    cy.contains("[data-testid=day]", "Monday").contains("1 spot remaining");
  });
  it("Should cancel an interview in the process of booking", () => {
    cy.get("[alt=Delete]").first().click({ force: true });
    cy.get(".appointment__actions > :nth-child(2)").click();
    cy.contains("Deleting").should("exist");
    cy.contains("Deleteing").should("not.exist");

    cy.contains("[data-testid=day]", "Monday").contains("2 spots remaining");
  });
});
