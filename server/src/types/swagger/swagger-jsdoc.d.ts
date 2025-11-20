declare module "swagger-jsdoc" {
  export interface Options {
    definition: object;
    apis: string[];
  }
  const swaggerJSDoc: (options: any) => any;
  export default swaggerJSDoc;
}