import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default function Og() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 128,
          width: "100%",
          height: "100%",
        }}
        tw="bg-[#FF955F]"
      >
        {/* eslint-disable @next/next/no-img-element */}
        <img
          alt="atto workshop"
          tw="mx-auto my-auto w-2/3"
          src="https://attoworkshops.com/logo_with_name.png"
        />
      </div>
    )
  );
}
