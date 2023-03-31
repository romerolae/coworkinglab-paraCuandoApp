/* eslint-disable quotes */

const { describe, expect, test, it, beforeAll, mock, afterAll } = require("@jest/globals");
const request = require("supertest");
/**
 * Remember, app is our aplication with endpoints (routes), controllers, services...
 * So, use the envs vars
 *  DATABASE_URI_TEST = postgres://DB_USER:DB_PASSWORD@ localost:DB_PORT/DB_NAME
 *  NODE_ENV = test
 */
const { app } = require("../index");


afterAll(() => {
  console.info("El entorno está en: " + process.env.NODE_ENV);

  console.info("Recuerda que debes:");
  console.info("1) Usar una DB para test");
  console.info("2) Configurarla de manera correcta en el .env");
});

let adminToken, user2Token, user3Token;

/****** Auth Login *****/

test("Login Credentials", async () => {
  /* User 1 Admin */
  const userAdminCredentials = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email: "user1admin@academlo.com",
      password: "passworduser1admin",
    });
  expect(userAdminCredentials.status).toBe(200);
  expect(userAdminCredentials.body.token).toBeTruthy();
  adminToken = userAdminCredentials.body.token;

  /* User 2 Public */
  const user2Credentials = await request(app).post("/api/v1/auth/login").send({
    email: "user2@academlo.com",
    password: "passworduser2",
  });
  expect(user2Credentials.status).toBe(200);
  expect(user2Credentials.body.token).toBeTruthy();
  user2Token = user2Credentials.body.token;

  /* User 3 Public */
  const user3Credentials = await request(app).post("/api/v1/auth/login").send({
    email: "user3@academlo.com",
    password: "passworduser3",
  });
  expect(user3Credentials.status).toBe(200);
  expect(user3Credentials.body.token).toBeTruthy();
  user3Token = user3Credentials.body.token;

  /* Returns Error 401 - Wrong Credentials*/
  const wrongPassword = await request(app).post("/api/v1/auth/login").send({
    email: "user3@academlo.com",
    password: "password",
  });
  expect(wrongPassword.status).toBe(401);

  /* Returns Error 404 - Not Found User */
  const wrongUser = await request(app).post("/api/v1/auth/login").send({
    email: "notexist@academlo.com",
    password: "password",
  });
  expect(wrongUser.status).toBe(404);
});

/***** Countries ******/

test("Get Paginated Countries - Admin", async () => {
  const countriesAsAdmin = await request(app)
    .get("/api/v1/countries")
    .set("Authorization", `Bearer ${adminToken}`);
  
  expect(countriesAsAdmin.status).toBe(200);
  expect(countriesAsAdmin.body.results).toEqual({
    count: 1,
    totalPages: 1,
    currentPage: 1,
    results: [
      {
        id: 1,
        name: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
    ],
  });

});

test("Get Paginated Countries - Public", async () => {
  const countriesAsPublic = await request(app)
    .get("/api/v1/countries")
    .set("Authorization", `Bearer ${user2Token}`);
  expect(countriesAsPublic.status).toBe(200);
  expect(countriesAsPublic.body.results).toEqual({
    count: 1,
    totalPages: 1,
    currentPage: 1,
    results: [
      {
        id: 1,
        name: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
    ],
  });

});

test("Get Paginated Countries - No Auth", async () => {
  const countries = await request(app).get("/api/v1/countries");
  expect(countries.status).toBe(401);
});

/***** States ******/

test("Get Paginated States - Admin", async () => {
  const statesAsAdmin = await request(app)
    .get("/api/v1/states")
    .set("Authorization", `Bearer ${adminToken}`);
  
  expect(statesAsAdmin.status).toBe(200);
  expect(statesAsAdmin.body.results).toEqual({
    count: 1,
    totalPages: 1,
    currentPage: 1,
    results: [
      {
        id: 1,
        country_id: 1,
        name: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }
    ]
  });

});

test("Get Paginated States - Public", async () => {
  const statesAsPublic = await request(app)
    .get("/api/v1/states")
    .set("Authorization", `Bearer ${user2Token}`);
  
  expect(statesAsPublic.status).toBe(200);
  expect(statesAsPublic.body.results).toEqual({
    count: 1,
    totalPages: 1,
    currentPage: 1,
    results: [
      {
        id: 1,
        country_id: 1,
        name: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }
    ]
  });

});

test("Get Paginated States - No Auth", async () => {
  const statesNoAuth = await request(app).get("/api/v1/states");
  expect(statesNoAuth.status).toBe(401);
});

/***** Cities ******/

test("Get Paginated Cities - Admin", async () => {
  const citiesAsAdmin = await request(app)
    .get("/api/v1/cities")
    .set("Authorization", `Bearer ${adminToken}`);
  
  expect(citiesAsAdmin.status).toBe(200);
  expect(citiesAsAdmin.body.results).toEqual({
    count: 1,
    totalPages: 1,
    currentPage: 1,
    results: [
      {
        id: 1,
        state_id: 1,
        name: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }
    ]
  });

});

test("Get Paginated Cities - Public", async () => {
  const citiesAsPublic = await request(app)
    .get("/api/v1/cities")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(citiesAsPublic.status).toBe(200);
  expect(citiesAsPublic.body.results).toEqual({
    count: 1,
    totalPages: 1,
    currentPage: 1,
    results: [
      {
        id: 1,
        state_id: 1,
        name: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }
    ]
  });

});

test("Get Paginated Cities - No Auth", async () => {
  const citiesNoAuth = await request(app).get("/api/v1/cities");
  expect(citiesNoAuth.status).toBe(401);
});

/***** Roles ******/

test("Get Paginated Roles - Admin", async () => {
  const rolesAsAdmin = await request(app)
    .get("/api/v1/roles")
    .set("Authorization", `Bearer ${adminToken}`);

  expect(rolesAsAdmin.status).toBe(200);
  expect(rolesAsAdmin.body.results).toEqual({
    count: 2,
    totalPages: 1,
    currentPage: 1,
    results: [
      {
        id: 1,
        name: 'public',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      {
        id: 2,
        name: 'admin',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }
    ]
  });

});

test("Get Paginated Roles - Public ", async () => {
  const rolesAsPublic = await request(app)
    .get("/api/v1/roles")
    .set("Authorization", `Bearer ${user2Token}`);
  
  expect(rolesAsPublic.status).toBe(200);
  expect(rolesAsPublic.body.results).toEqual({
    count: 2,
    totalPages: 1,
    currentPage: 1,
    results: [
      {
        id: 1,
        name: 'public',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      {
        id: 2,
        name: 'admin',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }
    ]
  });

});

test("Get Paginated Roles - No Auth ", async () => {
  const rolesNoAuth = await request(app).get("/api/v1/roles");
  expect(rolesNoAuth.status).toBe(401);
});

/***** Tags *****/

test("Get Paginated Tags - Admin", async () => {
  const tagsAsAdmin = await request(app)
    .get("/api/v1/tags")
    .set("Authorization", `Bearer ${adminToken}`);
  
  expect(tagsAsAdmin.status).toBe(200);
  expect(tagsAsAdmin.body.results).toEqual({
    count: 9,
    totalPages: 1,
    currentPage: 1,
    results: expect.arrayContaining(
      [
        expect.objectContaining(
          {
            id: expect.any(Number),
            name: expect.any(String),
            image_url: null,
            description: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }
        )
      ]
    ),
  });

});

test("Get Paginated Tags - Public", async () => {
  const tagsAsPublic = await request(app)
    .get("/api/v1/tags")
    .set("Authorization", `Bearer ${user2Token}`);
  
  expect(tagsAsPublic.status).toBe(200);
  expect(tagsAsPublic.body.results).toEqual({
    count: 9,
    totalPages: 1,
    currentPage: 1,
    results: expect.arrayContaining(
      [
        expect.objectContaining(
          {
            id: expect.any(Number),
            name: expect.any(String),
            image_url: null,
            description: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }
        )
      ]
    ),
  });

});

test("Get Paginated Tags - No Auth", async () => {
  const tagsNoAuth = await request(app)
    .get("/api/v1/tags")
  
  expect(tagsNoAuth.status).toBe(401);
});


test("Get One Tag - Admin", async () => {
  const tagAsAdmin = await request(app)
    .get("/api/v1/tags/1")
    .set("Authorization", `Bearer ${adminToken}`);
  
  expect(tagAsAdmin.status).toBe(200);
  expect(tagAsAdmin.body.results).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      image_url: null,
      description: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  );

});

test("Get One Tag - Public", async () => {
  const tagAsPublic = await request(app)
    .get("/api/v1/tags/1")
    .set("Authorization", `Bearer ${user2Token}`);
  
  expect(tagAsPublic.status).toBe(200);
  expect(tagAsPublic.body.results).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      image_url: null,
      description: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  );

});

test("Get One Tag - No Auth", async () => {
  const tagNoAuth = await request(app)
    .get("/api/v1/publications-types/1")
  
  expect(tagNoAuth.status).toBe(401);
});


test("Update One Tag - Admin", async () => {
  const tagAsAdmin = await request(app)
    .put("/api/v1/tags/1")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: 'tag edited by test',
      description: 'tag updated by test',
    })
  
  expect(tagAsAdmin.status).toBe(200);


  const getTagAsPublic = await request(app)
    .get("/api/v1/tags/1")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(getTagAsPublic.status).toBe(200);
  expect(getTagAsPublic.body.results).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      name: 'tag edited by test',
      description: 'tag updated by test',
      image_url: null,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  );


});

test("Update One Tag - Public", async () => {
  const tagAsPublic = await request(app)
    .put("/api/v1/tags/1")
    .set("Authorization", `Bearer ${user2Token}`);
  
  expect(tagAsPublic.status).toBe(403);

});

test("Update One Tag - No Auth", async () => {
  const tagAsPublic = await request(app)
    .put("/api/v1/tags/1")
  
  expect(tagAsPublic.status).toBe(401);

});


test("Add One Tag - Admin", async () => {
  const tagAsAdmin = await request(app)
    .post("/api/v1/tags")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: 'the one added tag admin',
      description: 'the one added tag admin',
    })
  
  expect(tagAsAdmin.status).toBe(201);


  const newTagAsAdmin = await request(app)
    .get("/api/v1/tags/10")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(newTagAsAdmin.status).toBe(200);
  expect(newTagAsAdmin.body.results).toEqual(
    expect.objectContaining({
      id: 10,
      name: 'the one added tag admin',
      description: 'the one added tag admin',
      image_url: null,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  );

})

test("Add One Tag - Public", async () => {
  const tagAsAdmin = await request(app)
    .post("/api/v1/tags")
    .set("Authorization", `Bearer ${user2Token}`)
    .send({
      name: 'the one added tag public',
      description: 'the one added tag public',
    })
  
  expect(tagAsAdmin.status).toBe(403);

});

test("Add One Tag - No Auth", async () => {
  const tagAsAdmin = await request(app)
    .post("/api/v1/tags")
    .send({
      name: 'the one added tag no auth',
      description: 'the one added tag no auth',
    })
  
  expect(tagAsAdmin.status).toBe(401);

});


test("Remove One Tag - Admin", async () => {
  const newTagAsAdmin = await request(app)
    .delete("/api/v1/tags/10")
    .set("Authorization", `Bearer ${adminToken}`);

  expect(newTagAsAdmin.status).toBe(200);
  expect(newTagAsAdmin.body.results).toEqual(
    expect.objectContaining({
      id: 10,
      name: 'the one added tag admin',
      description: 'the one added tag admin',
      image_url: null,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  );
  expect(newTagAsAdmin.body.message).toEqual(
    expect.stringMatching('removed')
  );

})

test("Remove One Tag Which Not Exist - Admin", async () => {
  const newTagAsAdmin = await request(app)
    .delete("/api/v1/tags/10")
    .set("Authorization", `Bearer ${adminToken}`);

  expect(newTagAsAdmin.status).toBe(404);
})

test("Remove One Tag - Public", async () => {
  const tagAsAdmin = await request(app)
    .delete("/api/v1/tags/9")
    .set("Authorization", `Bearer ${user2Token}`)
  
  expect(tagAsAdmin.status).toBe(403);

});

test("Remove One Tag - No Auth", async () => {
  const tagAsAdmin = await request(app)
    .delete("/api/v1/tags/8")
  
  expect(tagAsAdmin.status).toBe(401);

});


/***** Publications Types *****/

test("Get Paginated Publiciations Types - Admin", async () => {
  const publicationsTypesAsAdmin = await request(app)
    .get("/api/v1/publications-types")
    .set("Authorization", `Bearer ${adminToken}`);
  
  expect(publicationsTypesAsAdmin.status).toBe(200);
  expect(publicationsTypesAsAdmin.body.results).toEqual({
    count: 3,
    totalPages: 1,
    currentPage: 1,
    results: expect.arrayContaining(
      [
        expect.objectContaining(
          {
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }
        )
      ]
    ),
  });

});

test("Get Paginated Publiciations Types - Public", async () => {
  const publicationsTypesAsPublic = await request(app)
    .get("/api/v1/publications-types")
    .set("Authorization", `Bearer ${user2Token}`);
  
  expect(publicationsTypesAsPublic.status).toBe(200);
  expect(publicationsTypesAsPublic.body.results).toEqual({
    count: 3,
    totalPages: 1,
    currentPage: 1,
    results: expect.arrayContaining(
      [
        expect.objectContaining(
          {
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }
        )
      ]
    ),
  });

});

test("Get Paginated Publiciations Types - No Auth", async () => {
  const publicationsTypesNoAuth = await request(app)
    .get("/api/v1/publications-types")
  
  expect(publicationsTypesNoAuth.status).toBe(401);
});


test("Get One Publiciation Type - Admin", async () => {
  const publicationsTypeAsAdmin = await request(app)
    .get("/api/v1/publications-types/1")
    .set("Authorization", `Bearer ${adminToken}`);
  
  expect(publicationsTypeAsAdmin.status).toBe(200);
  expect(publicationsTypeAsAdmin.body.results).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  );

});

test("Get One Publiciation Type - Public", async () => {
  const publicationsTypeAsPublic = await request(app)
    .get("/api/v1/publications-types/1")
    .set("Authorization", `Bearer ${user2Token}`);
  
  expect(publicationsTypeAsPublic.status).toBe(200);
  expect(publicationsTypeAsPublic.body.results).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  );

});

test("Get One Publiciation Type - No Auth", async () => {
  const publicationsTypeNoAuth = await request(app)
    .get("/api/v1/publications-types/1")
  
  expect(publicationsTypeNoAuth.status).toBe(401);
});


test("Update One Publiciation Type - Admin", async () => {
  const updatePublicationsTypeAsPublic = await request(app)
    .put("/api/v1/publications-types/1")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: 'publication type edited by test',
      description: 'publication type updated by test',
    })
  
  expect(updatePublicationsTypeAsPublic.status).toBe(200);


  const publicationsTypeAsPublic = await request(app)
    .get("/api/v1/publications-types/1")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(publicationsTypeAsPublic.status).toBe(200);
  expect(publicationsTypeAsPublic.body.results).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      name: 'publication type edited by test',
      description: 'publication type updated by test',
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  );


});

test("Update One Publiciation Type - Public", async () => {
  const publicationsTypeAsPublic = await request(app)
    .put("/api/v1/publications-types/1")
    .set("Authorization", `Bearer ${user2Token}`);
  
  expect(publicationsTypeAsPublic.status).toBe(403);

});

test("Update One Publiciation Type - No Auth", async () => {
  const publicationsTypeAsPublic = await request(app)
    .put("/api/v1/publications-types/1")
  
  expect(publicationsTypeAsPublic.status).toBe(401);

});

/***** Users *****/

test("Get Paginated Users - Admin", async () => {
  const tagsAsAdmin = await request(app)
    .get("/api/v1/users")
    .set("Authorization", `Bearer ${adminToken}`);
  
  expect(tagsAsAdmin.status).toBe(200);
  expect(tagsAsAdmin.body.results).toEqual({
    count: 3,
    totalPages: 1,
    currentPage: 1,
    results: expect.arrayContaining(
      [
        expect.objectContaining(
          {
            id: expect.any(String),
            first_name: expect.any(String),
            last_name: expect.any(String),
            email: expect.any(String),
            username: expect.any(String),
            email_verified: null,
            code_phone: null,
            phone: null,
            image_url: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }
        ), expect.not.objectContaining(
          {
            token: null,
            password: expect.any(String),
          }
        )
      ]
    ),
  });

});

test("Get Paginated Users - Public", async () => {
  const tagsAsPublic = await request(app)
    .get("/api/v1/users")
    .set("Authorization", `Bearer ${user2Token}`);
  
  expect(tagsAsPublic.status).toBe(403);
});

test("Get Paginated Users - No Auth", async () => {
  const tagsNoAuth = await request(app)
    .get("/api/v1/users")
  
  expect(tagsNoAuth.status).toBe(401);
});



test("Get Same User - Admin", async () => {
  
  const meAsAdmin = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${adminToken}`);

  expect(meAsAdmin.status).toBe(200);
  expect(meAsAdmin.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
      }
    )
  );

  expect(meAsAdmin.body.results).not.toHaveProperty('code_phone');
  expect(meAsAdmin.body.results).not.toHaveProperty('phone');
  expect(meAsAdmin.body.results).not.toHaveProperty('token');
  expect(meAsAdmin.body.results).not.toHaveProperty('password');
  
  let userId = meAsAdmin.body.results.id
  
  const sameUserAsAdmin = await request(app)
    .get(`/api/v1/users/${userId}`)
    .set("Authorization", `Bearer ${adminToken}`);
  
  expect(sameUserAsAdmin.status).toBe(200);
  
  expect(sameUserAsAdmin.body.results).not.toHaveProperty('profiles');
  expect(sameUserAsAdmin.body.results).not.toHaveProperty('token');
  expect(sameUserAsAdmin.body.results).not.toHaveProperty('password');
  
  expect(sameUserAsAdmin.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
        email_verified: null,
        code_phone: null,
        phone: null,
        image_url: null,
        interests: []
      }
    )
  );

});

test("Get Same User - Public", async () => {
  
  const meAsPublic = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(meAsPublic.status).toBe(200);
  expect(meAsPublic.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
      }
    )
  );

  expect(meAsPublic.body.results).not.toHaveProperty('code_phone');
  expect(meAsPublic.body.results).not.toHaveProperty('phone');
  expect(meAsPublic.body.results).not.toHaveProperty('token');
  expect(meAsPublic.body.results).not.toHaveProperty('password');
  
  let userId = meAsPublic.body.results.id
  
  const sameUserAsPublic = await request(app)
    .get(`/api/v1/users/${userId}`)
    .set("Authorization", `Bearer ${user2Token}`);
  
  expect(sameUserAsPublic.status).toBe(200);
  
  expect(sameUserAsPublic.body.results).not.toHaveProperty('profiles');
  expect(sameUserAsPublic.body.results).not.toHaveProperty('token');
  expect(sameUserAsPublic.body.results).not.toHaveProperty('password');
  
  expect(sameUserAsPublic.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
        email_verified: null,
        code_phone: null,
        phone: null,
        image_url: null,
        interests: []
      }
    )
  );

});



test("Get another User - Admin", async () => {
  
  const meAsPublic = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(meAsPublic.status).toBe(200);
    
  expect(meAsPublic.body.results).not.toHaveProperty("code_phone");
  expect(meAsPublic.body.results).not.toHaveProperty("phone");
  expect(meAsPublic.body.results).not.toHaveProperty("token");
  expect(meAsPublic.body.results).not.toHaveProperty("password");

  expect(meAsPublic.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
      }
    )
  );
  
  let userId = meAsPublic.body.results.id
  
  const otherUserAsAdmin = await request(app)
    .get(`/api/v1/users/${userId}`)
    .set("Authorization", `Bearer ${adminToken}`);
  
  expect(otherUserAsAdmin.status).toBe(200);
  
  expect(otherUserAsAdmin.body.results).not.toHaveProperty('profiles');
  expect(otherUserAsAdmin.body.results).not.toHaveProperty('token');
  expect(otherUserAsAdmin.body.results).not.toHaveProperty('password');
  
  expect(otherUserAsAdmin.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
        email_verified: null,
        code_phone: null,
        phone: null,
        image_url: null,
        interests: []
      }
    )
  );

});

test("Get another User - Public", async () => {
  
  const meAsPublic = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(meAsPublic.status).toBe(200);
  
  expect(meAsPublic.body.results).not.toHaveProperty('code_phone');
  expect(meAsPublic.body.results).not.toHaveProperty('phone');
  expect(meAsPublic.body.results).not.toHaveProperty('token');
  expect(meAsPublic.body.results).not.toHaveProperty('password');
  
  expect(meAsPublic.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
      }
    )
  );
  
  let userId = meAsPublic.body.results.id
  
  const otherUserPublic = await request(app)
    .get(`/api/v1/users/${userId}`)
    .set("Authorization", `Bearer ${user3Token}`);
  
  expect(otherUserPublic.status).toBe(200);
  
  expect(otherUserPublic.body.results).not.toHaveProperty('profiles');
  expect(otherUserPublic.body.results).not.toHaveProperty('token');
  expect(otherUserPublic.body.results).not.toHaveProperty('password');
  expect(otherUserPublic.body.results).not.toHaveProperty('phone');
  expect(otherUserPublic.body.results).not.toHaveProperty('code_phone');
  expect(otherUserPublic.body.results).not.toHaveProperty('email_verified');
  expect(otherUserPublic.body.results).not.toHaveProperty('email');
  
  expect(otherUserPublic.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        image_url: null,
        interests: []
      }
    )
  );
});

test("Get another User - No Auth", async () => {
  
  const meAsPublic = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(meAsPublic.status).toBe(200);
  
  expect(meAsPublic.body.results).not.toHaveProperty('code_phone');
  expect(meAsPublic.body.results).not.toHaveProperty('phone');
  expect(meAsPublic.body.results).not.toHaveProperty('token');
  expect(meAsPublic.body.results).not.toHaveProperty('password');
  
  expect(meAsPublic.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
      }
    )
  );
  
  let userId = meAsPublic.body.results.id
  
  const otherUserNoAuth = await request(app)
    .get(`/api/v1/users/${userId}`)
  
  expect(otherUserNoAuth.status).toBe(401);
  
});

test("Update same User - Public", async () => {
  
  const meAsPublic = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(meAsPublic.status).toBe(200);
  
  expect(meAsPublic.body.results).not.toHaveProperty('code_phone');
  expect(meAsPublic.body.results).not.toHaveProperty('phone');
  expect(meAsPublic.body.results).not.toHaveProperty('token');
  expect(meAsPublic.body.results).not.toHaveProperty('password');
  
  expect(meAsPublic.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
      }
    )
  );
  
  let userId = meAsPublic.body.results.id
  
  const sameUserPublic = await request(app)
    .put(`/api/v1/users/${userId}`)
    .set("Authorization", `Bearer ${user2Token}`)
    .send({
      first_name: 'edited first name',
      last_name: 'edited last name',
      code_phone: 'edited code phone',
      phone: 'edited phone',
      interests:'1,2,3'
    })
  
  expect(sameUserPublic.status).toBe(200);



  const checkMeAsPublic = await request(app)
    .get(`/api/v1/users/${userId}`)
    .set("Authorization", `Bearer ${user2Token}`);

  expect(checkMeAsPublic.status).toBe(200);
  
  expect(checkMeAsPublic.body.results).not.toHaveProperty('profiles');
  expect(checkMeAsPublic.body.results).not.toHaveProperty('token');
  expect(checkMeAsPublic.body.results).not.toHaveProperty('password');
  
  expect(checkMeAsPublic.body.results).toEqual(
    expect.objectContaining(
      {
        id: userId,
        first_name: 'edited first name',
        last_name: 'edited last name',
        code_phone: 'edited code phone',
        phone: 'edited phone',
        image_url: null,
        interests: expect.arrayContaining([
          expect.objectContaining(
            {
              id: expect.any(Number),
              name: expect.any(String),
              description: '',
              image_url: null,
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }
          )
        ])
      }
    )
  );
});


test("Update another User - Public", async () => {
  
  const meAsPublic = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(meAsPublic.status).toBe(200);
  
  expect(meAsPublic.body.results).not.toHaveProperty('code_phone');
  expect(meAsPublic.body.results).not.toHaveProperty('phone');
  expect(meAsPublic.body.results).not.toHaveProperty('token');
  expect(meAsPublic.body.results).not.toHaveProperty('password');
  
  expect(meAsPublic.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
      }
    )
  );
  
  let userId = meAsPublic.body.results.id
  
  const updateOtherUserPublic = await request(app)
    .put(`/api/v1/users/${userId}`)
    .set("Authorization", `Bearer ${user3Token}`)
    .send({
      first_name: 'publication type edited by test',
      last_name: 'publication type updated by test',
      code_phone: 'publication type updated by test',
      phone: 'publication type updated by test',
      interests:'1,2,3'
    })
  
  expect(updateOtherUserPublic.status).toBe(403);
});



/***** Publications *****/


test("Add One Publication - Public", async () => {
  const addApublicationAsPublic = await request(app)
    .post("/api/v1/publications")
    .set("Authorization", `Bearer ${user2Token}`)
    .send({
      publication_type_id: 2,
      title: 'title anything',
      description: 'description anything',
      content: 'content anything',
      reference_link: 'www.academlo.com',
      tags:'4,2,6'
    })
  
  expect(addApublicationAsPublic.status).toBe(201);

})

test("Get Paginated Publications - No Auth", async () => {
  const publicationsNoAuth = await request(app)
    .get("/api/v1/publications")
  
  expect(publicationsNoAuth.status).toBe(200);
  expect(publicationsNoAuth.body.results).toEqual({
    count: expect.any(Number),
    totalPages: 1,
    currentPage: 1,
    results: expect.arrayContaining(
      [
        expect.objectContaining(
          {
            id: expect.any(String),
            user_id: expect.any(String),
            publication_type_id: expect.any(Number),
            city_id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            content: expect.any(String),
            reference_link: expect.any(String),
            votes_count: expect.any(Number),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            images: [],
            user: expect.objectContaining({
              first_name: expect.any(String),
              last_name: expect.any(String),
              image_url: null,
            }),
            publication_type: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            tags: expect.arrayContaining([
              {
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                image_url: null,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }
            ])
          }
        )
      ]
    ),
  });

});


test("Get One Publications - No Auth", async () => {
  const publicationsNoAuth = await request(app)
    .get("/api/v1/publications")
    
  expect(publicationsNoAuth.status).toBe(200);
  
  let publicationID = publicationsNoAuth.body.results.results[0].id 
    
  const onePublicationNoAuth = await request(app)
    .get(`/api/v1/publications/${publicationID}`)
  
  expect(onePublicationNoAuth.status).toBe(200);

  expect(onePublicationNoAuth.body.results).toEqual(
    expect.objectContaining({
      id: publicationID,
      user_id: expect.any(String),
      publication_type_id: expect.any(Number),
      city_id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
      content: expect.any(String),
      reference_link: expect.any(String),
      votes_count: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      images: [],
      user: expect.objectContaining({
        first_name: expect.any(String),
        last_name: expect.any(String),
        image_url: null,
      }),
      publication_type: expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
      tags: expect.arrayContaining([
        {
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          image_url: null,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ]),
    })
  );

});

/***** Publications X User  Start *****/

test("Get User Votes - Public", async () => {
  
  const meAsPublic = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(meAsPublic.status).toBe(200);
  
  expect(meAsPublic.body.results).not.toHaveProperty('code_phone');
  expect(meAsPublic.body.results).not.toHaveProperty('phone');
  expect(meAsPublic.body.results).not.toHaveProperty('token');
  expect(meAsPublic.body.results).not.toHaveProperty('password');
  
  expect(meAsPublic.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
      }
    )
  );
  
  let userId = meAsPublic.body.results.id
  
  const sameUserVotes = await request(app)
    .get(`/api/v1/users/${userId}/votes`)
    .set("Authorization", `Bearer ${user2Token}`)
  
  expect(sameUserVotes.status).toBe(200);

  expect(sameUserVotes.body.results).toEqual({
    count: expect.any(Number),
    totalPages: 1,
    currentPage: 1,
    results: expect.arrayContaining(
      [
        expect.objectContaining(
          {
            id: expect.any(String),
            user_id: expect.any(String),
            publication_type_id: expect.any(Number),
            city_id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            content: expect.any(String),
            reference_link: expect.any(String),
            votes_count: expect.any(Number),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            images: [],
            user: expect.objectContaining({
              first_name: expect.any(String),
              last_name: expect.any(String),
              image_url: null,
            }),
            publication_type: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            tags: expect.arrayContaining([
              {
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                image_url: null,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }
            ])
          }
        )
      ]
    ),
  });

})

test("Get User Publications - Public", async () => {
  
  const meAsPublic = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(meAsPublic.status).toBe(200);
  
  expect(meAsPublic.body.results).not.toHaveProperty('code_phone');
  expect(meAsPublic.body.results).not.toHaveProperty('phone');
  expect(meAsPublic.body.results).not.toHaveProperty('token');
  expect(meAsPublic.body.results).not.toHaveProperty('password');
  
  expect(meAsPublic.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
      }
    )
  );
  
  let userId = meAsPublic.body.results.id
  
  const sameUserVotes = await request(app)
    .get(`/api/v1/users/${userId}/publications`)
    .set("Authorization", `Bearer ${user2Token}`)
  
  expect(sameUserVotes.status).toBe(200);

  expect(sameUserVotes.body.results).toEqual({
    count: expect.any(Number),
    totalPages: 1,
    currentPage: 1,
    results: expect.arrayContaining(
      [
        expect.objectContaining(
          {
            id: expect.any(String),
            user_id: userId,
            publication_type_id: expect.any(Number),
            city_id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            content: expect.any(String),
            reference_link: expect.any(String),
            votes_count: expect.any(Number),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            images: [],
            user: expect.objectContaining({
              first_name: expect.any(String),
              last_name: expect.any(String),
              image_url: null,
            }),
            publication_type: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            tags: expect.arrayContaining([
              {
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                image_url: null,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }
            ])
          }
        )
      ]
    ),
  });

})



test("Check User Vote Publication - Public", async () => {
  
  const publicationsNoAuth = await request(app)
    .get("/api/v1/publications");

  expect(publicationsNoAuth.status).toBe(200);

  let publicationID = publicationsNoAuth.body.results.results[0].id; 

  /* Add Vote */
  const votePublicationAsPublic = await request(app)
    .post(`/api/v1/publications/${publicationID}/vote`)
    .set("Authorization", `Bearer ${user3Token}`)
    
  expect(votePublicationAsPublic.status).toBe(201);

  
  
  const getVotedPublication = await request(app)
    .get(`/api/v1/publications/${publicationID}`)

  expect(getVotedPublication.status).toBe(200);

  /* It should be 2 votes! */
  expect(getVotedPublication.body.results).toEqual(
    expect.objectContaining({
      id: publicationID,
      user_id: expect.any(String),
      publication_type_id: expect.any(Number),
      city_id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
      content: expect.any(String),
      reference_link: expect.any(String),
      votes_count: 2,
      created_at: expect.any(String),
      updated_at: expect.any(String),
      images: [],
      user: expect.objectContaining({
        first_name: expect.any(String),
        last_name: expect.any(String),
        image_url: null,
      }),
      publication_type: expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
      tags: expect.arrayContaining([
        {
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          image_url: null,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ]),
    })
  );

  const removePublicationAsPublic = await request(app)
    .post(`/api/v1/publications/${publicationID}/vote`)
    .set("Authorization", `Bearer ${user3Token}`)

  /* Remove Vote */
  expect(removePublicationAsPublic.status).toBe(200);



  const getVotedRemovedPublication = await request(app)
    .get(`/api/v1/publications/${publicationID}`)

  expect(getVotedRemovedPublication.status).toBe(200);

  /* It should be 1 vote */
  expect(getVotedRemovedPublication.body.results).toEqual(
    expect.objectContaining({
      id: publicationID,
      user_id: expect.any(String),
      publication_type_id: expect.any(Number),
      city_id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
      content: expect.any(String),
      reference_link: expect.any(String),
      votes_count: 1,
      created_at: expect.any(String),
      updated_at: expect.any(String),
      images: [],
      user: expect.objectContaining({
        first_name: expect.any(String),
        last_name: expect.any(String),
        image_url: null,
      }),
      publication_type: expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
      tags: expect.arrayContaining([
        {
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          image_url: null,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ]),
    })
  );

})

/***** Publications X User  End *****/

/***** Publications *****/

test("Remove Publication - Check Same User, Public & Admin", async () => {
  const addApublicationAsPublic = await request(app)
    .post("/api/v1/publications")
    .set("Authorization", `Bearer ${user2Token}`)
    .send({
      publication_type_id: 2,
      title: 'title anything 2',
      description: 'description anything',
      content: 'content anything',
      reference_link: 'www.academlo.com',
      tags:'4,2,6'
    })
  
  expect(addApublicationAsPublic.status).toBe(201);

  /* Now, user2 has 2 publications */

  const publicationsNoAuth = await request(app)
    .get("/api/v1/publications")

  expect(publicationsNoAuth.status).toBe(200);
  expect(publicationsNoAuth.body.results).toEqual({
    count: expect.any(Number),
    totalPages: 1,
    currentPage: 1,
    results: expect.arrayContaining(
      [
        expect.objectContaining(
          {
            id: expect.any(String),
            user_id: expect.any(String),
            publication_type_id: expect.any(Number),
            city_id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            content: expect.any(String),
            reference_link: expect.any(String),
            votes_count: expect.any(Number),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            images: [],
            user: expect.objectContaining({
              first_name: expect.any(String),
              last_name: expect.any(String),
              image_url: null,
            }),
            publication_type: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            tags: expect.arrayContaining([
              {
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                image_url: null,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }
            ])
          }
        )
      ]
    ),
  });

  let publicationId1 = publicationsNoAuth.body.results.results[0].id 
  let publicationId2 = publicationsNoAuth.body.results.results[1].id 


  /* Different User can't delete a publication */
  const removePublicationAsPublic = await request(app)
    .delete(`/api/v1/publications/${publicationId2}`)
    .set("Authorization", `Bearer ${user3Token}`)

  expect(removePublicationAsPublic.status).toBe(403);
  
  /* Admin can delete any publication */
  const removePublicationAsAdmin = await request(app)
    .delete(`/api/v1/publications/${publicationId2}`)
    .set("Authorization", `Bearer ${adminToken}`)

  expect(removePublicationAsAdmin.status).toBe(200);
  
  /* 
    Different User can't delete a publication, but because not exist,
    return not found 404
  */
  const notFoundRemovedPublicationAsPublic = await request(app)
    .delete(`/api/v1/publications/${publicationId2}`)
    .set("Authorization", `Bearer ${user3Token}`)

  expect(notFoundRemovedPublicationAsPublic.status).toBe(404);

  /* Admin can't delete it because was removed before */
  const notFoundRemovedPublicationAsAdmin = await request(app)
    .delete(`/api/v1/publications/${publicationId2}`)
    .set("Authorization", `Bearer ${adminToken}`)

  expect(notFoundRemovedPublicationAsAdmin.status).toBe(404);


  /* Owner of publication can remove a publication */
  const removePublicationAsOwner = await request(app)
    .delete(`/api/v1/publications/${publicationId1}`)
    .set("Authorization", `Bearer ${user2Token}`)

  expect(removePublicationAsOwner.status).toBe(200);

  /* Owner of publication can remove a publication */
  const notFoundRemovedPublicationAsOwner = await request(app)
    .delete(`/api/v1/publications/${publicationId1}`)
    .set("Authorization", `Bearer ${user2Token}`)

  expect(notFoundRemovedPublicationAsOwner.status).toBe(404);



})