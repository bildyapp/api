const swaggerJsdoc = require("swagger-jsdoc")

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Bildy - Express API with Swagger (OpenAPI 3.1)",
            version: "0.1.0",
            description:
                "This is a CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "bildy",
                url: "https://bildy.com",
                email: "rpmaya@gmail.com",
            },
        },
        servers: [
            {
                url: "https://bildy-rpmaya.koyeb.app/",
                description: "Testing"
            },
            {
                url: "http://localhost:8000/",
                description: "Local"
            },
            {
                url: "https://fascinating-madelena-bildyapp-be63757b.koyeb.app/",
                description: "Production"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer"
                },
            },
            schemas: {
                deliveryNoteDataComplete: {
                    type: "object",
                    example: {
                        "company": {
                            "name": "SERVITOP, SL",
                            "cif": "BXXXXXXXX",
                            "street": "Carlos V",
                            "number": 22,
                            "postal": 28936,
                            "city": "Móstoles",
                            "province": "Madrid"
                        },
                        "name": "Ricardo",
                        "date": "2024-06-07T07:28:09.444Z",
                        "client": {
                            "name": "FCC",
                            "address": {
                                "street": "Carlos III",
                                "number": 22,
                                "postal": 28936,
                                "city": "Móstoles",
                                "province": "Madrid"
                            },
                            "cif": "A12345679"
                        },
                        "project": "0002",
                        "description": "my description",
                        "format": "hours",
                        "hours": 7,
                        "sign": "/path/to/sign3",
                        "pdf": "/path/to/pdf3"
                    }
                },
                deliveryNoteList: {
                    type: "object",
                    example: [
                        {
                            "_id": "6662b6281b4bb98dab88453f",
                            "userId": "6661d631b3456d765e39af78",
                            "clientId": "6662a8c3c199795c88329e4e",
                            "projectId": "6662afde03013916089bc058",
                            "format": "hours",
                            "hours": 7,
                            "description": "my description",
                            "sign": "/path/to/sign3",
                            "pending": true,
                            "createdAt": "2024-06-07T07:26:32.121Z",
                            "updatedAt": "2024-06-07T07:28:09.444Z",
                            "__v": 0
                        }
                    ]
                },
                deliveryNoteData: {
                    type: "object",
                    example: {
                        "_id": "6662b6281b4bb98dab88453f",
                        "userId": "6661d631b3456d765e39af78",
                        "clientId": "6662a8c3c199795c88329e4e",
                        "projectId": "6662afde03013916089bc058",
                        "format": "hours",
                        "hours": 8,
                        "description": "my description 3",
                        "sign": "/path/to/sign2",
                        "pending": true,
                        "pdf": "/path/to/pdf3",
                        "createdAt": "2024-06-07T07:26:32.121Z",
                        "updatedAt": "2024-06-07T07:26:32.121Z",
                        "__v": 0
                    }
                },
                projectDataList: {
                    type: "object",
                    example: [
                        {
                            "address": {
                                "street": "Carlos II",
                                "number": 22,
                                "postal": 28936,
                                "city": "Móstoles",
                                "province": "Madrid"
                            },
                            "_id": "6662afde03013916089bc058",
                            "userId": "6661d631b3456d765e39af78",
                            "clientId": "6662a8c3c199795c88329e4e",
                            "name": "Obra Y",
                            "projectCode": "Id-proyect",
                            "code": "0002",
                            "createdAt": "2024-06-07T06:59:42.824Z",
                            "updatedAt": "2024-06-07T07:02:51.854Z",
                            "__v": 0,
                            "begin": "07-01-2024",
                            "end": "06-04-2025",
                            "notes": "no acabado"
                        }
                    ]
                },
                projectDataComplete: {
                    type: "object",
                    example: {
                        "address": {
                            "street": "Carlos II",
                            "number": 22,
                            "postal": 28936,
                            "city": "Móstoles",
                            "province": "Madrid"
                        },
                        "_id": "6662afde03013916089bc058",
                        "userId": "6661d631b3456d765e39af78",
                        "clientId": "6662a8c3c199795c88329e4e",
                        "name": "Obra Y",
                        "projectCode": "Id-proyect",
                        "code": "0002",
                        "createdAt": "2024-06-07T06:59:42.824Z",
                        "updatedAt": "2024-06-07T07:02:51.854Z",
                        "__v": 0,
                        "begin": "07-01-2024",
                        "end": "06-04-2025",
                        "notes": "no acabado"
                    }
                },
                projectData: {
                    type: "object",
                    example: {
                        "userId": "6661d631b3456d765e39af78",
                        "clientId": "6662a8c3c199795c88329e4e",
                        "name": "Obra Y",
                        "code": "0002",
                        "_id": "6662afde03013916089bc058",
                        "createdAt": "2024-06-07T06:59:42.824Z",
                        "updatedAt": "2024-06-07T06:59:42.824Z",
                        "__v": 0
                    }
                },
                clientDataList: {
                    type: "object",
                    example: [
                        {
                            "address": {
                                "street": "Carlos III",
                                "number": 22,
                                "postal": 28936,
                                "city": "Móstoles",
                                "province": "Madrid"
                            },
                            "_id": "6662a8c3c199795c88329e4e",
                            "userId": "6661d631b3456d765e39af78",
                            "name": "FCC",
                            "cif": "A12345679",
                            "createdAt": "2024-06-07T06:29:23.473Z",
                            "updatedAt": "2024-06-07T06:42:05.793Z",
                            "__v": 0,
                            "logo": "http://myfiles/storage/pic1.jpg",
                            "activeProjects": 2,
                            "pendingDeliveryNotes": 2
                        }
                    ]
                },
                clientDataComplete: {
                    type: "object",
                    example: {
                        "address": {
                            "street": "Carlos III",
                            "number": 22,
                            "postal": 28936,
                            "city": "Móstoles",
                            "province": "Madrid"
                        },
                        "_id": "6662a8c3c199795c88329e4e",
                        "userId": "6661d631b3456d765e39af78",
                        "name": "FCC",
                        "cif": "A12345679",
                        "createdAt": "2024-06-07T06:29:23.473Z",
                        "updatedAt": "2024-06-07T06:42:05.793Z",
                        "__v": 0,
                        "logo": "http://myfiles/storage/pic1.jpg"
                    }
                },
                clientData: {
                    type: "object",
                    example: {
                        "userId": "6661d631b3456d765e39af78",
                        "name": "FCC",
                        "cif": "A12345679",
                        "_id": "6662a8c3c199795c88329e4e",
                        "createdAt": "2024-06-07T06:29:23.473Z",
                        "updatedAt": "2024-06-07T06:29:23.473Z",
                        "__v": 0
                    }
                },
                userDataAll: {
                    type: "object",
                    example: {
                        "address": {
                            "street": "Carlos V",
                            "number": 22,
                            "postal": 28936,
                            "city": "Móstoles",
                            "province": "Madrid"
                        },
                        "company": {
                            "name": "SERVITOP, SL",
                            "cif": "BXXXXXXXX",
                            "street": "Carlos V",
                            "number": 22,
                            "postal": 28936,
                            "city": "Móstoles",
                            "province": "Madrid"
                        },
                        "_id": "6661d631b3456d765e39af78",
                        "email": "ricardo.palacios@immune.institute",
                        "emailCode": "483270",
                        "status": 1,
                        "role": "user",
                        "createdAt": "2024-06-06T15:30:57.985Z",
                        "updatedAt": "2024-06-07T06:19:32.954Z",
                        "__v": 0,
                        "name": "Ricardo",
                        "nif": "10000000W",
                        "surnames": "Prueba Pruebas"
                    }
                },
                userDataLogin: {
                    type: "object",
                    properties: {
                        token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjYxZDYzMWIzNDU2ZDc2NWUzOWFmNzgiLCJyb2xlIjoidXNlciIsImlhdCI6MTcxNzY4Nzg1OCwiZXhwIjoxNzIwMjc5ODU4fQ.XL5wbLRp9_2EFT_nJK-tU2eBF4Kp6hZaLq1yochsHT1"
                        },
                        user: {
                            type: "object",
                            example: {
                                "email": "r.pal@immune.com",
                                "role": "user",
                                "_id": "6661d631b3456d765e39af78",
                                "name": "Ricardo"
                            }
                        }
                    }
                },
                userDataComplete: {
                    type: "object",
                    example: {
                        "_id": "6661d631b3456d765e39af78",
                        "email": "ricardo.palacios@immune.institute",
                        "emailCode": "483270",
                        "status": 1,
                        "role": "user",
                        "createdAt": "2024-06-06T15:30:57.985Z",
                        "updatedAt": "2024-06-06T15:59:14.061Z",
                        "__v": 0,
                        "name": "Ricardo",
                        "nif": "10000000W",
                        "surnames": "Prueba Pruebas"
                    }
                },
                userData: {
                    type: "object",
                    properties: {
                        token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjYxZDYzMWIzNDU2ZDc2NWUzOWFmNzgiLCJyb2xlIjoidXNlciIsImlhdCI6MTcxNzY4Nzg1OCwiZXhwIjoxNzIwMjc5ODU4fQ.XL5wbLRp9_2EFT_nJK-tU2eBF4Kp6hZaLq1yochsHT1"
                        },
                        user: {
                            type: "object",
                            example: {
                                "email": "r.pal@immune.com",
                                "status": 0,
                                "role": "user",
                                "_id": "6661d631b3456d765e39af78",
                            }
                        }
                    }
                },
                userDataRecover: {
                    type: "object",
                    properties: {
                        user: {
                            type: "object",
                            example: {
                                "email": "r.pal@immune.com",
                                "status": 0,
                                "role": "user",
                                "_id": "6661d631b3456d765e39af78",
                            }
                        }
                    }
                },
                mail: {
                    type: "object",
                    required: ["subject", "text", "to", "from"],
                    properties: {
                        subject: {
                            type: "string",
                            example: "Test"
                        },
                        text: {
                            type: "string",
                            example: "I am sending an email"
                        },
                        to: {
                            type: "string",
                            example: "destination@gmail.com"
                        },
                        from: {
                            type: "string",
                            example: "bildy@gmail.com"
                        }
                    }
                },
                mailCode: {
                    type: "object",
                    required: ["code"],
                    properties: {
                        code: {
                            type: "string",
                            example: "000000"
                        }
                    }
                },
                mailRecover: {
                    type: "object",
                    required: ["email", "code"],
                    properties: {
                        email: {
                            type: "string",
                            example: "r.pal@gmail.com"
                        },
                        code: {
                            type: "string",
                            example: "000000"
                        }
                    }
                },
                mailUser: {
                    type: "object",
                    required: ["email"],
                    properties: {
                        email: {
                            type: "string",
                            example: "mimail@gmail.com"
                        }
                    }
                },
                google: {
                    type: "object",
                    required: ["token"],
                    properties: {
                        token: {
                            type: "string"
                        }
                    }
                },
                user: {
                    type: "object",
                    required: ["email", "name", "surnames", "nif"],
                    properties: {
                        email: {
                            type: "string",
                            example: "miemail@gmail.com"
                        },
                        name: {
                            type: "string",
                            example: "José"
                        },
                        surnames: {
                            type: "string",
                            example: "García Pérez"
                        },
                        nif: {
                            type: "string",
                            example: "40000000W"
                        },
                    },
                },
                userRole: {
                    type: "object",
                    required: ["role"],
                    properties: {
                        role: {
                            type: "string",
                            example: "user"
                        }
                    }
                },
                userAddr: {
                    type: "object",
                    required: ["address"],
                    properties: {
                        address: {
                            type: "object",
                            properties: {
                                street: {
                                    type: "string",
                                    example: "Carlos V"
                                },
                                number: {
                                    type: "integer",
                                    example: 22
                                },
                                postal: {
                                    type: "integer",
                                    example: 28936
                                },
                                city: {
                                    type: "string",
                                    example: "Móstoles"
                                },
                                province: {
                                    type: "string",
                                    example: "Madrid"
                                }
                            }
                        }
                    }
                },
                userInvitation: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            example: "guest@gmail.com"
                        },
                        password: {
                            type: "string",
                            example: "password"
                        },
                        company: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                    example: "Servitop, SL."
                                },
                                cif: {
                                    type: "string",
                                    example: "BXXXXXXXX"
                                },
                                street: {
                                    type: "string",
                                    example: "Carlos V"
                                },
                                number: {
                                    type: "integer",
                                    example: 22
                                },
                                postal: {
                                    type: "integer",
                                    example: 28936
                                },
                                city: {
                                    type: "string",
                                    example: "Móstoles"
                                },
                                province: {
                                    type: "string",
                                    example: "Madrid"
                                }
                            }
                        }
                    }
                },
                userCompany: {
                    type: "object",
                    required: ["company"],
                    properties: {
                        company: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                    example: "Servitop, SL."
                                },
                                cif: {
                                    type: "string",
                                    example: "BXXXXXXXX"
                                },
                                street: {
                                    type: "string",
                                    example: "Carlos V"
                                },
                                number: {
                                    type: "integer",
                                    example: 22
                                },
                                postal: {
                                    type: "integer",
                                    example: 28936
                                },
                                city: {
                                    type: "string",
                                    example: "Móstoles"
                                },
                                province: {
                                    type: "string",
                                    example: "Madrid"
                                }
                            }
                        }
                    }
                },
                userPass: {
                    type: "object",
                    required: ["password"],
                    properties: {
                        password: {
                            type: "string"
                        }
                    }
                },
                internalCode: {
                    type: "object",
                    required: ["code"],
                    properties: {
                        code: {
                            type: "string",
                            example: "12345-23"
                        }
                    }
                },
                sign: {
                    type: "object",
                    required: ["sign"],
                    properties: {
                        sign: {
                            type: "string",
                            example: "/path/to/sign"
                        }
                    }
                },
                observations: {
                    type: "object",
                    required: ["observations"],
                    properties: {
                        observations: {
                            type: "string",
                            example: "Observaciones ..."
                        }
                    }
                },
                login: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            example: "miemail@gmail.com"
                        },
                        password: {
                            type: "string"
                        },
                    }
                },
                clients: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: {
                            type: "string",
                            example: "ACS"
                        },
                        cif: {
                            type: "string",
                            example: "D52921210"
                        },
                        address: {
                            type: "object",
                            properties: {
                                street: {
                                    type: "string",
                                    example: "Carlos V"
                                },
                                number: {
                                    type: "integer",
                                    example: 22
                                },
                                postal: {
                                    type: "integer",
                                    example: 28936
                                },
                                city: {
                                    type: "string",
                                    example: "Móstoles"
                                },
                                province: {
                                    type: "string",
                                    example: "Madrid"
                                }
                            }
                        }
                    }
                },
                clientComplete: {
                    type: "object",
                    required: ["name", "cif"],
                    properties: {
                        name: {
                            type: "string",
                            example: "ACS"
                        },
                        cif: {
                            type: "string",
                            example: "D52921210"
                        },
                        address: {
                            type: "object",
                            properties: {
                                street: {
                                    type: "string",
                                    example: "Carlos V"
                                },
                                number: {
                                    type: "integer",
                                    example: 22
                                },
                                postal: {
                                    type: "integer",
                                    example: 28936
                                },
                                city: {
                                    type: "string",
                                    example: "Móstoles"
                                },
                                province: {
                                    type: "string",
                                    example: "Madrid"
                                }
                            }
                        }
                    }
                },
                notifications: {
                    type: "object",
                    required: ["notifications"],
                    properties: {
                        name: {
                            type: "boolean",
                            example: "true"
                        }
                    }
                },
                close: {
                    type: "object",
                    required: ["close"],
                    properties: {
                        name: {
                            type: "boolean",
                            example: "true"
                        }
                    }
                },
                active: {
                    type: "object",
                    required: ["active"],
                    properties: {
                        name: {
                            type: "boolean",
                            example: "false"
                        }
                    }
                },
                projects: {
                    type: "object",
                    required: ["name", "projectCode", "client"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Nombre del proyecto"
                        },
                        projectCode: {
                            type: "string",
                            example: "Identificador de proyecto"
                        },
                        email: {
                            type: "string",
                            example: "mimail@gmail.com"
                        },
                        address: {
                            type: "object",
                            properties: {
                                street: {
                                    type: "string",
                                    example: "Carlos V"
                                },
                                number: {
                                    type: "integer",
                                    example: 22
                                },
                                postal: {
                                    type: "integer",
                                    example: 28936
                                },
                                city: {
                                    type: "string",
                                    example: "Móstoles"
                                },
                                province: {
                                    type: "string",
                                    example: "Madrid"
                                }
                            }
                        },
                        code: {
                            type: "string",
                            example: "Código interno del proyecto"
                        },
                        client: {
                            type: "string",
                            example: "mongoId"
                        }
                    }
                },
                projectComplete: {
                    type: "object",
                    required: ["name", "projectCode", "code", "client", "notes"],
                    properties: {
                        name: {
                            type: "string",
                            example: "obra"
                        },
                        code: {
                            type: "string",
                            example: "00001-01"
                        },
                        projectCode: {
                            type: "string",
                            example: "100000"
                        },
                        email: {
                            type: "string",
                            example: "mimail@gmail.com"
                        },
                        client: {
                            type: "string",
                            example: "mongoId"
                        },
                        address: {
                            type: "object",
                            properties: {
                                street: {
                                    type: "string",
                                    example: "Carlos V"
                                },
                                number: {
                                    type: "integer",
                                    example: 22
                                },
                                postal: {
                                    type: "integer",
                                    example: 28936
                                },
                                city: {
                                    type: "string",
                                    example: "Móstoles"
                                },
                                province: {
                                    type: "string",
                                    example: "Madrid"
                                }
                            }
                        },
                        notes: {
                            type: "string",
                            example: "XXX XXX XXXX"
                        }
                    }
                },
                deliveryNote: {
                    type: "object",
                    required: ["clientId", "projectId", "type", "description"],
                    properties: {
                        clientId: {
                            type: "string",
                            example: "mongoId"
                        },
                        projectId: {
                            type: "string",
                            example: "mongoId"
                        },
                        format: {
                            "type": "string",
                            "example": "material or hours"
                        },
                        material: {
                            "type": "string",
                            "example": "type of material"
                        },
                        hours: {
                            "type": "integer",
                            "example": 8
                        },
                        description: {
                            "type": "string",
                            "example": "my description"
                        },
                        workdate: {
                            "type": "string",
                            "example": "2/1/2024"
                        }
                    }
                }
            },
        },
    },
    apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options)