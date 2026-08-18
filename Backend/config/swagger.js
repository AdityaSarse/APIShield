import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.3",

  info: {
    title: "APIShield API",
    version: "1.0.0",
    description:
      "API Gateway, API Key Management, Rate Limiting, Analytics and Monitoring API",
  },

  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },

      apiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
      },
    },

    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          statusCode: {
            type: "integer",
            example: 200,
          },
          message: {
            type: "string",
            example: "Request successful",
          },
          data: {
            type: "object",
            nullable: true,
          },
        },
      },

      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          statusCode: {
            type: "integer",
            example: 401,
          },
          message: {
            type: "string",
            example: "Unauthorized",
          },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,

  apis: [
    "./modules/**/*.routes.js",
    "./modules/**/*.controller.js",
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
