// Dependencias
import React, { useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "../../store";

interface Props {
  handleSubmit: () => void;
  handleRemove: () => void;
}

const Profile = ({ handleSubmit, handleRemove }: Props) => {
  const [policyPrivacy, setPolicyPrivacy] = useState<boolean>(false);

  const { linkedAccountant, accountant } = useSelector(
    (state: RootState) => state.accountant,
  );

  return (
    <>
      <h2>Perfil</h2>
      <p>{accountant?.profile || linkedAccountant?.profile}</p>

      {!linkedAccountant && (
        <div className="form-check mt-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="aviso-privacidad"
            id="aviso-privacidad"
            checked={policyPrivacy}
            onChange={(e) => {
              const { checked } = e.target;

              setPolicyPrivacy(checked);
            }}
          />

          <label className="form-check-label" htmlFor="aviso-privacidad">
            I have read and agree to the{" "}
            <a href="https://google.com">privacy policy</a>
          </label>
        </div>
      )}

      <button
        className="btn btn-sm btn-dark mt-3"
        type="button"
        disabled={linkedAccountant ? false : !policyPrivacy}
        onClick={!linkedAccountant ? handleSubmit : handleRemove}
      >
        {linkedAccountant ? "Remove accountant" : "Link accountant"}
      </button>
    </>
  );
};

export default Profile;
