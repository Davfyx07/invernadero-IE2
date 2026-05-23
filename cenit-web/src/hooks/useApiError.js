import { useToast } from "../components/Toast";
import { useI18n } from "./useI18n";

export function useApiError() {
  const { show } = useToast();
  const { t } = useI18n();

  const handleError = (err, options = {}) => {
    const { setFormError, fallbackKey = "common.error.generic" } = options;

    if (!err?.response) {
      const msg = t("common.error.network");
      setFormError?.(msg);
      show(msg, "error");
      return msg;
    }

    const status = err.response.status;
    const serverMsg = err.response.data?.message;
    let msg = serverMsg;

    if (status === 401) msg = t("common.error.unauthorized");
    else if (status === 403) msg = t("common.error.forbidden");
    else if (status === 404) msg = t("common.error.notFound");
    else if (status === 409) msg = t("common.error.conflict");
    else if (status >= 500) msg = t("common.error.server");
    else msg = serverMsg || t(fallbackKey);

    setFormError?.(msg);
    show(msg, "error");
    return msg;
  };

  return { handleError };
}
