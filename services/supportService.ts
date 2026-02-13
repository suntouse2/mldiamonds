import axios from "axios";

export default async function getSupport() {
  const { data } = await axios.get<{ url: string }>(
    "https://360payments.biz/api/projects/13/support"
  );
  return data.url;
}
