import React, { useRef, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Check, FilePlus, RotateCcw, X } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors } from "../../../theme";
import {
  createSellerOrderReport,
  uploadSellerOrderReportEvidence,
  type SellerReportEvidenceAsset,
  type SellerReportReason,
} from "../api/seller-reports";
import { sellerOrderReportStyles as styles } from "./seller-order-report.styles";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const reasons: Array<{ value: SellerReportReason; label: string }> = [
  { value: "pickup_problem", label: "Pickup problem" },
  { value: "conduct", label: "Conduct" },
  { value: "listing_inaccurate", label: "Listing inaccurate" },
  { value: "other", label: "Other" },
];

interface SellerOrderReportModalProps {
  orderId: string;
  visible: boolean;
  onClose: () => void;
}

export function SellerOrderReportModal({ orderId, visible, onClose }: SellerOrderReportModalProps) {
  const [reason, setReason] = useState<SellerReportReason>("pickup_problem");
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState<SellerReportEvidenceAsset[]>([]);
  const [reportId, setReportId] = useState<string | null>(null);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const controller = useRef<AbortController | null>(null);

  const reset = () => {
    setReason("pickup_problem"); setDetails(""); setFiles([]); setReportId(null);
    setUploadedCount(0); setUploadingIndex(null); setFormError(null); setUploadError(null); setSubmitted(false); setSubmitting(false);
  };

  const close = () => { if (uploadingIndex !== null) controller.current?.abort(); reset(); onClose(); };

  const chooseFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ALLOWED_TYPES, multiple: true, copyToCacheDirectory: true });
    if (result.canceled) return;
    const accepted: SellerReportEvidenceAsset[] = [];
    const rejected: string[] = [];
    for (const asset of result.assets) {
      if (!asset.mimeType || !ALLOWED_TYPES.includes(asset.mimeType) || (asset.size ?? 0) > MAX_FILE_BYTES) rejected.push(asset.name);
      else accepted.push({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType, size: asset.size ?? 0 });
    }
    if (rejected.length) setFormError(`These files need to be JPG, PNG, WebP, or PDF files under 5 MB: ${rejected.join(", ")}`);
    setFiles((current) => [...current, ...accepted].slice(0, 5));
  };

  const uploadEvidence = async (id: string) => {
    controller.current = new AbortController(); setUploadError(null);
    for (let index = uploadedCount; index < files.length; index += 1) {
      if (controller.current.signal.aborted) return false;
      setUploadingIndex(index);
      try {
        await uploadSellerOrderReportEvidence(orderId, id, files[index], controller.current.signal);
        setUploadedCount(index + 1);
      } catch (error: any) {
        const stopped = controller.current.signal.aborted;
        setUploadError(stopped ? "Upload stopped. Your report is saved. Resume when you are ready." : error?.message || `Could not upload ${files[index].name}.`);
        setUploadingIndex(null); controller.current = null; return false;
      }
    }
    setUploadingIndex(null); controller.current = null; return true;
  };

  const submit = async () => {
    if (!reportId && details.trim().length < 5) { setFormError("Add at least 5 characters so we know what happened."); return; }
    setFormError(null); setUploadError(null); setSubmitting(true);
    try {
      const id = reportId || (await createSellerOrderReport(orderId, reason, details.trim())).id;
      if (!reportId) setReportId(id);
      if (await uploadEvidence(id)) setSubmitted(true);
    } catch (error: any) { setFormError(error?.message || "Could not record this report."); }
    finally { setSubmitting(false); }
  };

  return <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
    <View style={styles.backdrop}><ScrollView style={styles.sheet} contentContainerStyle={styles.actions}>
      <View style={styles.header}><Text style={styles.title}>Report this order</Text><Pressable onPress={close} style={styles.fileButton}><X size={22} color={colors.textMuted} /></Pressable></View>
      <Text style={styles.text}>Your report will be recorded for platform monitoring. Add details and optional evidence.</Text>
      {submitted ? <View><View style={styles.successRow}><Check size={18} color={colors.success} /><Text style={styles.text}>Report recorded. Thank you for letting us know.</Text></View><ButtonComponent title="Done" onPress={close} style={{ marginTop: 20 }} /></View> : <>
        {!reportId ? <><Text style={styles.label}>What happened?</Text><View style={styles.reasonRow}>{reasons.map((item) => <Pressable key={item.value} onPress={() => setReason(item.value)} style={[styles.reason, reason === item.value ? styles.reasonSelected : null]}><Text style={[styles.reasonText, reason === item.value ? styles.reasonTextSelected : null]}>{item.label}</Text></Pressable>)}</View><Text style={styles.label}>Details</Text><TextInput value={details} onChangeText={setDetails} maxLength={2000} multiline placeholder="Tell us what happened" style={styles.input} /><Text style={styles.count}>{details.length}/2,000</Text></> : null}
        <Text style={styles.label}>Evidence (optional, up to 5 files)</Text>{files.map((file, index) => <View key={`${file.uri}-${index}`} style={styles.fileRow}><Text style={styles.fileName} numberOfLines={1}>{file.name}</Text><Text style={styles.fileStatus}>{index < uploadedCount ? "Uploaded" : index === uploadingIndex ? "Uploading…" : "Waiting"}</Text></View>)}
        {!reportId && files.length < 5 ? <ButtonComponent title="Add evidence" onPress={chooseFiles} variant="secondary" icon={<FilePlus size={18} color={colors.primary} />} /> : null}
        {formError ? <Text style={styles.error}>{formError}</Text> : null}{uploadError ? <Text style={styles.error}>{uploadError}</Text> : null}
        {uploadingIndex !== null ? <ButtonComponent title="Stop upload" onPress={() => controller.current?.abort()} variant="secondary" /> : <ButtonComponent title={reportId ? "Resume uploads" : "Send report"} onPress={submit} loading={submitting} icon={reportId ? <RotateCcw size={18} color={colors.white} /> : undefined} />}
      </>}
    </ScrollView></View>
  </Modal>;
}
