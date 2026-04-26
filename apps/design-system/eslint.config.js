import { reactConfig } from "@template/eslint-config";

export default [...reactConfig, { ignores: ["dist/", "storybook-static/"] }];
