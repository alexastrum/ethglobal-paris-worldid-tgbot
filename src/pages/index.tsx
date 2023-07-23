import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import type { VerifyReply } from "./api/verify";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [msg, setMsg] = useState(""); // Declare a state variable...

  const query = useRouter().query;
  const userId = query["userId"] || "";
  const chat = query["chat"] || "";
  const vote = query["vote"] || "";

  const signal = JSON.stringify({ userId, vote, msg });
  const action = `tgbot-${chat}`;

  const onSuccess = (result: ISuccessResult) => {
    // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
    window.alert(
      "Successfully verified with World ID! Your nullifier hash is: " +
        result.nullifier_hash
    );
  };

  const handleProof = async (result: ISuccessResult) => {
    console.log("Proof received from IDKit:\n", JSON.stringify(result)); // Log the proof from IDKit to the console for visibility
    const reqBody = {
      merkle_root: result.merkle_root,
      nullifier_hash: result.nullifier_hash,
      proof: result.proof,
      credential_type: result.credential_type,
      action,
      signal,
    };
    console.log(
      "Sending proof to backend for verification:\n",
      JSON.stringify(reqBody)
    ); // Log the proof being sent to our backend for visibility
    const res: Response = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    const data: VerifyReply = await res.json();
    if (res.status == 200) {
      console.log("Successful response from backend:\n", data); // Log the response from our backend for visibility
    } else {
      throw new Error(
        `Error code ${res.status} (${data.code}): ${data.detail}` ??
          "Unknown error."
      ); // Throw an error if verification fails
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center align-middle h-screen">
        {!userId && !chat && (
          <a
            className="link text-2xl mb-5"
            href="https://t.me/+bf5rQhNnnqRkMzlh"
          >
            Join Telegram channel
          </a>
        )}
        {!!userId && <p className="text-2xl mb-5">Confirm humanhood</p>}
        {!!chat && !!vote && <p className="text-2xl mb-5">Vote {vote}</p>}
        {!!chat && !vote && (
          <>
            <p className="text-2xl">Anonymously post message</p>
            <input
              className="border border-black rounded-md mx-3 mb-5 px-3 py-1"
              value={msg} // ...force the input's value to match the state variable...
              onChange={(e) => setMsg(e.target.value)} // ... and update the state variable on any edits!
            />
          </>
        )}
        {(!!userId || !!chat) && (
          <IDKitWidget
            action={process.env.NEXT_PUBLIC_WLD_ACTION_NAME!}
            app_id={process.env.NEXT_PUBLIC_WLD_APP_ID!}
            onSuccess={onSuccess}
            handleVerify={handleProof}
            credential_types={[CredentialType.Orb, CredentialType.Phone]}
            signal={signal}
            autoClose
            enableTelemetry
          >
            {({ open }) => (
              <button className="border border-black rounded-md" onClick={open}>
                <div className="mx-3 my-1">Verify with World ID</div>
              </button>
            )}
          </IDKitWidget>
        )}
      </div>
    </div>
  );
}
