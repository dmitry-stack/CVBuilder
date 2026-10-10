"use client";

import { useRouter } from "next/navigation";
import { CVDialog } from "@/features/cvs/ui/CVDialog";
import { DeleteCVDialog } from "@/features/cvs/ui/DeleteCVDialog";
import { useHeaderContext } from "@/shared/components/layout/HeaderContext";
import { useTranslation } from "@/i18n";
import { CVTableToolbar } from "./CVTableToolbar";
import { CVTableHeader } from "./CVTableHeader";
import { CVTableRow } from "./CVTableRow";
import {
  useCvsTable,
  type CVItem,
  type UseCvsTableProps,
} from "../hooks/useCvsTable";

export type { CVItem };
export type CVTableProps = UseCvsTableProps;

export function CVTable(props: CVTableProps = {}) {
  const router = useRouter();
  const { t } = useTranslation();
  const { setUserName } = useHeaderContext();

  const {
    isOwner,
    search,
    setSearch,
    sortField,
    sortOrder,
    handleSort,
    filteredCvs,
    dialogState,
    setDialogState,
    deleteDialogState,
    setDeleteDialogState,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    handleConfirmDelete,
  } = useCvsTable(props);

  const handleNavigateToCv = (cvItem: CVItem) => {
    setUserName(cvItem.name || null, cvItem.id);
    router.push(`/cvs/${cvItem.id}/details`);
  };

  const handleOpenDelete = (cvItem: CVItem) => {
    setDeleteDialogState({ isOpen: true, data: cvItem });
  };

  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <CVTableToolbar
        search={search}
        onSearchChange={setSearch}
        isOwner={isOwner}
        onOpenCreate={handleOpenCreate}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <CVTableHeader
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          <tbody>
            {filteredCvs.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm text-cv-muted dark:text-zinc-400"
                >
                  {t("cvs.noCvsFound")}
                </td>
              </tr>
            ) : (
              filteredCvs.map((cv, index) => (
                <CVTableRow
                  key={cv.id}
                  cv={cv}
                  index={index}
                  isOwner={isOwner}
                  onNavigate={handleNavigateToCv}
                  onOpenEdit={handleOpenEdit}
                  onOpenDelete={handleOpenDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <CVDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, data: null })}
        onSave={handleSave}
        initialData={dialogState.data}
      />

      <DeleteCVDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState({ isOpen: false, data: null })}
        onConfirm={handleConfirmDelete}
        cvName={deleteDialogState.data?.name || ""}
      />
    </div>
  );
}
