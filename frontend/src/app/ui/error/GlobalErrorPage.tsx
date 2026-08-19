import { useRouteError } from "react-router-dom";
import { AppError } from "@/shared/errors/AppError";
import Unauthorized from "./Unauthorized";
import Forbidden from "./Forbidden";
import NotFound from "./NotFoundPage";
import InternalServerError from "./InternalServerError";

export default function GlobalErrorPage() {
  const error = useRouteError();

  if (error instanceof AppError) {
    switch (error.status) {
      case 401:
        return <Unauthorized />;
      case 403:
        return <Forbidden />;
      case 404:
        return <NotFound />;
      default:
        return <InternalServerError />;
    }
  }

  return <InternalServerError />;
}
