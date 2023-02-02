import supertest from "supertest";
import app from "../src/index";
import fruits from "../src/data/fruits"

const api = supertest(app);

beforeAll(() => { fruits.slice(fruits.length) });
afterAll(() => { fruits.slice(fruits.length) });

describe("POST /fruits", () => {
    it("Should respond with status 200 if valid body.", async () => {
        await api.post("/fruits").send({
            "name": "Banana",
            "price": 20.00
        });

        await api.post("/fruits").send({
            "name": "Melão",
            "price": 30.00
        });

        const result = await api.get("/fruits");
        expect(result.body).toHaveLength(2);

        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "id": expect.any(Number),
                    "name": expect.any(String),
                    "price": expect.any(Number)
                })
            ])
        );

        expect(result.status).toBe(200);
    });

    it("Should respond with status 422 if sent body format is wrong.", async () => {

        const additionalPropety = await api.post("/fruits").send({
            "name": "Laranja",
            "price": 20.00,
            "description": "Muito boa essa fruta xd"
        });
        expect(additionalPropety.status).toBe(422);

        const missingPrice = await api.post("/fruits").send({
            "name": "Laranja",
        });
        expect(missingPrice.status).toBe(422);

        const missingName = await api.post("/fruits").send({
            "price": "20.00"
        });
        expect(missingName.status).toBe(422);

        const result = await api.get("/fruits");
        expect(result.body).toHaveLength(2);
    });

    it("Should respond with status 409 if sent fruit name is already registered.", async () => {
        const conflictPost = await api.post("/fruits").send({
            name: "Banana",
            price: 20.00
        });

        const result = await api.get("/fruits");
        expect(result.body).toHaveLength(2);
        expect(conflictPost.status).toBe(409);
    });
});

describe("GET /fruits/:id", () => {

    it("Should respond with status 404 if id params is wrong", async () => {
        const result = await api.get("/fruits/0");
        expect(result.status).toBe(404);
    });

    it("Should respond with status 404 if id params is wrong", async () => {
        const result = await api.get("/fruits/404");
        expect(result.status).toBe(404);
    });

    it("Should respond with status 200 id params exists", async () => {
        const result = await api.get("/fruits/1");
        expect(result.status).toBe(200);
        expect(result.body).toEqual(
            expect.objectContaining({
                "id": 1,
                "name": "Banana",
                "price": 20.00
            })
        );
    });
});

describe("GET /fruits", () => {

    it("Should respond with status 200 if valid response", async () => {
        const result = await api.get("/fruits");
        expect(result.status).toBe(200);
        expect(result.body).toHaveLength(2);
        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: expect.any(String),
                    price: expect.any(Number)
                })
            ])
        );
    });
});

