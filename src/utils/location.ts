export interface SelectedLocation {
  country: string;
  department: string;
  city: string;
}

export const getSavedLocation = (): SelectedLocation => ({
  country: localStorage.getItem("lumi_pais") || "",
  department: localStorage.getItem("lumi_departamento") || "",
  city: localStorage.getItem("lumi_ciudad") || "",
});
