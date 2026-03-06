const request = require("supertest");
const app = require("../app");

// Test email non vide
describe("POST /invitations", () => {
  it("should return 400 if email is missing", async () => {
    const res = await request(app).post("/invitations").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.result).toBe(false);
  });

  // Test email doublon
  it("should prevent duplicate invitations", async () => {
    const email = "student@test.com";

    // invit 1
    await request(app).post("/invitations").send({ email });

    // invit 2 avec le même email
    const res = await request(app).post("/invitations").send({ email });

    expect(res.statusCode).toBe(400);
    expect(res.body.result).toBe(false);
  });
});
