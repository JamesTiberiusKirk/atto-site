import type { Application } from "types/application";
import ReactDOMServer from "react-dom/server";
import { workshops } from "types/workshop";

export function GenerateApplicationAdminEmailString(a: Application) {
  const lookupWorkshop = (name: string): string => {
    for (const w of workshops) {
      if (w.key === name) {
        return w.instructorName;
      }
    }
    return "";
  };

  return ReactDOMServer.renderToString(
    <>
      <h1>Administrator&apos;s report</h1>

      <p style={{ fontSize: "15px" }}>New Application</p>
      {/* {applications && applications?.length > 0 && ( */}
      <div
        style={{
          border: "#FF955F 2px solid",
          padding: "5px",
          margin: "5px",
        }}
      >
        <p style={{ fontSize: "20px" }}>Applications:</p>

        <div
          style={{
            borderBottom: "#8C2F00 2px solid",
          }}
        >
          <p style={{ fontSize: "15px" }}>Name: {a.name}</p>

          <p style={{ fontSize: "15px" }}>Email: {a.email}</p>

          <p style={{ fontSize: "15px" }}>Pronouns: {a.pronouns}</p>

          <p style={{ fontSize: "15px" }}>Credits: {a.credits}</p>

          <p style={{ fontSize: "15px" }}>Workshops selected:</p>
          <ul>
            {a.workshops.map((w) => (
              <li key={w} style={{ fontSize: "15px" }}>
                {lookupWorkshop(w) + " "}
              </li>
            ))}
          </ul>

          <p style={{ fontSize: "15px" }}>
            Email preference: {!a.emailPreference ? "opt in" : "opt out"}
          </p>

          <p>
            Referee:
            {a.referee !== undefined ? (
              <>
                <b>Name: </b>
                {a.referee?.name}
                <br />
                <b>Pronouns: </b>
                {a.referee?.pronouns}
                <br />
                <b>Email: </b>
                {a.referee?.email}
                <br />
                <b>Phrone Number: </b>
                {a.referee?.phoneNumber}
                <br />
              </>
            ) : (
              <>None</>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
