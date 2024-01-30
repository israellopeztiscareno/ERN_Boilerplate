// Dependencias
import React from "react";
import type { PropsWithChildren } from "react";

// Estilos
import "../assets/styles/acceso.scss";

interface Props {
  id: string;
  col?: string;
}

const EnrollmentLayout = (props: PropsWithChildren<Props>) => {
  const { id, col = "col-12 col-xxl-11", children } = props;

  return (
    <main>
      <section
        id={id}
        data-testid={`test_id__${id}`}
        className="bg-light p-3 p-md-4 p-xl-5 h-100"
      >
        <div className="container h-100">
          <div
            className={`row ${
              col ? "justify-content-center " : ""
            }align-items-center h-100`}
          >
            <div className={col}>
              <div className="card border-light-subtle shadow-sm">
                <div className="row g-0">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EnrollmentLayout;
