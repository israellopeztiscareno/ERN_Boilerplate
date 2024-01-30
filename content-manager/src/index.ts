export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Get the Google Provider services
    await strapi
      .service("plugin::users-permissions.providers-registry")
      .register(`google`, ({ purest }) => async ({ query }) => {
        const google = purest({ provider: "google" });

        /*
          Once the user clicks on the Google button get the access_token
          and called the Google endpoint oauth2/v3/userinfo to get more
          informations about the user
        */
        const res = await google
          .get("https://www.googleapis.com/oauth2/v3/userinfo")
          .auth(query.access_token)
          .request();

        /*
          Do not hesitate to log body looks like and used it to return
          some data
        */

        const { body } = res;

        /*
          The returned Object is the Object which sends to the Database
          to create a User
        */

        return {
          email: body.email,
          name: body.name,
          firstname: body.given_name,
          lastname: body.family_name,
          picture: body.picture,
          provider: "google",
          username: body.email.split("@")[0],
        };
      });
  },
};
