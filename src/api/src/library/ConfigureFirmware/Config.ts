export interface Config {
  product_name: string;
  lua_name?: string;
  layout_file?: string;
  upload_methods: string[];
  platform: string;
  firmware: string;
  features?: string[];
  prior_target_name: string;
  overlay?: { [key: string]: string };
}
