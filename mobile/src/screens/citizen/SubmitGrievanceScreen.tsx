import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Camera, MapPin, UploadCloud, Info, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import { complaintService } from '../../services/complaint.service';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { GlassCard } from '../../components/shared/GlassCard';
import Toast from 'react-native-toast-message';

function severityLabel(priority?: string) {
  if (!priority) return 'Pending model triage';
  return priority;
}

function normalizePrediction(complaint: any) {
  if (complaint.prediction && complaint.prediction.status !== 'QUEUED') {
    return complaint.prediction;
  }

  const savedPrediction = complaint.predictions?.[0];
  if (savedPrediction) {
    return {
      validity: savedPrediction.validity,
      validity_confidence: savedPrediction.validityConfidence,
      priority: savedPrediction.priority,
      priority_confidence: savedPrediction.priorityConfidence,
      trust_score: savedPrediction.trustScore,
    };
  }

  const model1 = complaint.aiModelOutputs?.find(
    (output: any) => output.modelName === 'MODEL_1_AUTHENTICITY_PRIORITY',
  );
  if (model1) {
    const processed = model1.processedOutput || {};
    return {
      validity: processed.validity || model1.classification,
      validity_confidence: Number(processed.validityConfidence || model1.confidenceScore || 0),
      priority: processed.priority || model1.priorityLevel,
      priority_confidence: Number(processed.priorityConfidence || model1.priorityScore || 0),
      trust_score: processed.trustScore,
      unavailable: model1.status === 'FAILED',
      error: model1.errorLog?.message,
    };
  }

  return {
    unavailable: false,
    status: complaint.prediction?.status || 'QUEUED',
    error: 'AI processing is still running. The values will appear here automatically.',
  };
}

async function waitForPrediction(complaintId: string) {
  let latest: any = null;
  for (let attempt = 0; attempt < 18; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, attempt === 0 ? 1200 : 2500));
    latest = await complaintService.getById(complaintId);
    const model1 = latest.aiModelOutputs?.find(
      (output: any) => output.modelName === 'MODEL_1_AUTHENTICITY_PRIORITY',
    );
    if (latest.predictions?.length || model1) return latest;
  }
  return latest;
}

const CATEGORIES = ['Infrastructure & Roads', 'Sanitation & Waste', 'Public Safety & Police', 'Water & Utilities', 'Civic Services'];
const SUB_CATEGORIES = ['Pothole / Road Damage', 'Broken Streetlight', 'Traffic Signal Malfunction', 'Sidewalk Blockage'];

export function SubmitGrievanceScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  
  // Form Data
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subCategory, setSubCategory] = useState(SUB_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  
  const [locationStr, setLocationStr] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [images, setImages] = useState<{uri: string, base64: string}[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  
  const handleDetectLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'Location permission is required.' });
        setIsLocating(false);
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocationStr(`${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to detect location.' });
    } finally {
      setIsLocating(false);
    }
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      Toast.show({ type: 'error', text1: 'Limit reached', text2: 'Max 5 images allowed.' });
      return;
    }
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'Gallery permission is required.' });
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.6,
      base64: true,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.base64) {
        setImages([...images, { uri: asset.uri, base64: asset.base64 }]);
      }
    }
  };

  const takePhoto = async () => {
    if (images.length >= 5) {
      Toast.show({ type: 'error', text1: 'Limit reached', text2: 'Max 5 images allowed.' });
      return;
    }
    
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'Camera permission is required.' });
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.6,
      base64: true,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.base64) {
        setImages([...images, { uri: asset.uri, base64: asset.base64 }]);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setPredictionResult(null);
    try {
      const complaint = await complaintService.create({
        title: `${subCategory} - ${locationStr || 'Location pending'}`,
        description: [
          `Category: ${category}`,
          `Sub-category: ${subCategory}`,
          `Location: ${locationStr || 'Not provided'}`,
          `Description: ${description.trim() || 'No description provided'}`,
        ].join('\n'),
        priority: 'medium',
        category,
        subCategory,
        attachments: images.map((img) => ({
          fileUrl: `data:image/jpeg;base64,${img.base64}`,
          fileName: img.uri.split('/').pop() || `evidence-${Date.now()}.jpg`,
        })),
      });
      
      Toast.show({ type: 'success', text1: 'Success', text2: 'Complaint submitted successfully!' });
      
      setPredictionResult({
        complaint: complaint.id,
        ...normalizePrediction(complaint),
        whatsappNotification: complaint.whatsappNotification,
      });

      setStep(4);

      waitForPrediction(complaint.id)
        .then((latest) => {
          if (!latest) return;
          setPredictionResult({
            complaint: latest.id,
            ...normalizePrediction(latest),
            whatsappNotification: complaint.whatsappNotification,
          });
        })
        .catch(() => undefined);
      
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to submit complaint.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCategory(CATEGORIES[0]);
    setSubCategory(SUB_CATEGORIES[0]);
    setDescription('');
    setLocationStr('');
    setImages([]);
    setPredictionResult(null);
    // @ts-ignore
    navigation.navigate('Overview');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Official Grievance Form</Text>
        <Text style={styles.subtitle}>Please provide accurate details. False reporting may result in civic penalties.</Text>
      </View>

      <GlassCard style={styles.card}>
        <View style={styles.progressBar}>
          {[1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <View style={[styles.stepDot, step >= i && styles.stepDotActive]}>
                <Text style={[styles.stepDotText, step >= i && styles.stepDotTextActive]}>{i}</Text>
              </View>
              {i < 3 && <View style={[styles.stepLine, step > i && styles.stepLineActive]} />}
            </React.Fragment>
          ))}
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.label}>Primary Category</Text>
              <View style={styles.pickerFake}>
                <Text style={styles.pickerText}>{category}</Text>
              </View>
              
              <Text style={styles.label}>Sub-Category</Text>
              <View style={styles.pickerFake}>
                <Text style={styles.pickerText}>{subCategory}</Text>
              </View>

              <Text style={styles.label}>Detailed Description</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={6}
                placeholder="Provide specific details..."
                placeholderTextColor={colors.slate500}
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.label}>Location Coordinates</Text>
              <View style={styles.locationRow}>
                <View style={styles.inputIconWrapper}>
                  <MapPin color={colors.slate400} size={16} style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputWithIcon}
                    placeholder="Enter location..."
                    placeholderTextColor={colors.slate500}
                    value={locationStr}
                    onChangeText={setLocationStr}
                  />
                </View>
                <TouchableOpacity style={styles.detectBtn} onPress={handleDetectLocation} disabled={isLocating}>
                  {isLocating ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.detectBtnText}>Detect</Text>
                  )}
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { marginTop: 24 }]}>Photographic Evidence</Text>
              <View style={styles.evidenceRow}>
                <TouchableOpacity style={styles.evidenceBtn} onPress={takePhoto}>
                  <Camera color={colors.primaryLight} size={24} />
                  <Text style={styles.evidenceBtnText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.evidenceBtn} onPress={pickImage}>
                  <UploadCloud color={colors.primaryLight} size={24} />
                  <Text style={styles.evidenceBtnText}>Gallery</Text>
                </TouchableOpacity>
              </View>
              
              {images.length > 0 && (
                <View style={styles.imagesGrid}>
                  {images.map((img, idx) => (
                    <Image key={idx} source={{ uri: img.uri }} style={styles.thumbnail} />
                  ))}
                </View>
              )}
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContent}>
              <View style={styles.reviewAlert}>
                <Info color={colors.primaryLight} size={20} />
                <View style={styles.reviewAlertContent}>
                  <Text style={styles.reviewAlertTitle}>Automated Triage Ready</Text>
                  <Text style={styles.reviewAlertText}>
                    This report will be analyzed by AI upon submission.
                  </Text>
                </View>
              </View>

              <View style={styles.reviewBox}>
                <Text style={styles.reviewBoxTitle}>Final Review</Text>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewItemLabel}>Category</Text>
                  <Text style={styles.reviewItemValue}>{category}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewItemLabel}>Sub-Category</Text>
                  <Text style={styles.reviewItemValue}>{subCategory}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewItemLabel}>Location</Text>
                  <Text style={styles.reviewItemValue}>{locationStr || 'Not provided'}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewItemLabel}>Images</Text>
                  <Text style={styles.reviewItemValue}>{images.length} attached</Text>
                </View>
              </View>
            </View>
          )}

          {step === 4 && predictionResult && (
            <View style={styles.stepContent}>
              <View style={styles.predictionBox}>
                <Text style={styles.predictionBoxTitle}>AI Model Output</Text>
                
                {predictionResult.unavailable && (
                  <Text style={styles.predictionErrorText}>Model service unavailable: {predictionResult.error}</Text>
                )}
                {!predictionResult.unavailable && predictionResult.status === 'QUEUED' && (
                  <Text style={styles.predictionQueuedText}>{predictionResult.error}</Text>
                )}

                <View style={styles.predictionGrid}>
                  <View style={styles.predictionItemFull}>
                    <Text style={styles.predictionItemLabel}>Tracking ID</Text>
                    <Text style={styles.predictionItemValue}>{predictionResult.complaint}</Text>
                  </View>
                  <View style={styles.predictionItem}>
                    <Text style={styles.predictionItemLabel}>Validity</Text>
                    <Text style={styles.predictionItemValue}>{predictionResult.validity ?? 'Model pending'}</Text>
                  </View>
                  <View style={styles.predictionItem}>
                    <Text style={styles.predictionItemLabel}>Priority</Text>
                    <Text style={styles.predictionItemValue}>{severityLabel(predictionResult.priority)}</Text>
                  </View>
                  <View style={styles.predictionItem}>
                    <Text style={styles.predictionItemLabel}>Validity Confidence</Text>
                    <Text style={styles.predictionItemValue}>
                      {predictionResult.validity_confidence != null ? `${predictionResult.validity_confidence}%` : 'Model pending'}
                    </Text>
                  </View>
                  <View style={styles.predictionItem}>
                    <Text style={styles.predictionItemLabel}>Priority Confidence</Text>
                    <Text style={styles.predictionItemValue}>
                      {predictionResult.priority_confidence != null ? `${predictionResult.priority_confidence}%` : 'Model pending'}
                    </Text>
                  </View>
                  <View style={styles.predictionItem}>
                    <Text style={styles.predictionItemLabel}>Trust Score</Text>
                    <Text style={styles.predictionItemValue}>{predictionResult.trust_score != null ? predictionResult.trust_score : 'Model pending'}</Text>
                  </View>
                  <View style={styles.predictionItemFull}>
                    <Text style={styles.predictionItemLabel}>WhatsApp Confirmation</Text>
                    <Text style={styles.predictionItemValue}>
                      {predictionResult.whatsappNotification?.sent ? 'Sent' : predictionResult.whatsappNotification?.reason || 'Not sent'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step === 4 ? (
            <TouchableOpacity 
              style={[styles.footerBtn, styles.footerBtnPrimary, { flex: 1, justifyContent: 'center' }]}
              onPress={resetForm}
            >
              <Text style={styles.footerBtnPrimaryText}>Go to Overview</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity 
                style={[styles.footerBtn, step === 1 && styles.footerBtnHidden]}
                onPress={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                <ChevronLeft color={colors.slate300} size={18} />
                <Text style={styles.footerBtnText}>Back</Text>
              </TouchableOpacity>

              {step < 3 ? (
                <TouchableOpacity 
                  style={[styles.footerBtn, styles.footerBtnPrimary]}
                  onPress={() => {
                    if (step === 1 && description.length < 10) {
                      Toast.show({ type: 'error', text1: 'Description too short', text2: 'Please provide more details.' });
                      return;
                    }
                    setStep(step + 1);
                  }}
                >
                  <Text style={styles.footerBtnPrimaryText}>Next</Text>
                  <ChevronRight color={colors.white} size={18} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.footerBtn, styles.footerBtnPrimary]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.footerBtnPrimaryText}>Submit</Text>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1020', padding: 20, paddingTop: 60 },
  header: { marginBottom: 24 },
  title: { color: colors.white, fontSize: typography.size['2xl'], fontWeight: typography.weight.bold, marginBottom: 8 },
  subtitle: { color: colors.slate400, fontSize: typography.size.sm, lineHeight: 20 },
  
  card: { flex: 1, padding: 0 },
  progressBar: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: colors.primary },
  stepDotText: { color: colors.slate400, fontSize: typography.size.xs, fontWeight: typography.weight.bold },
  stepDotTextActive: { color: colors.white },
  stepLine: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 8 },
  stepLineActive: { backgroundColor: colors.primary },

  formContainer: { flex: 1, padding: 20 },
  stepContent: { paddingBottom: 20 },
  
  label: { color: colors.slate400, fontSize: typography.size.xs, fontWeight: typography.weight.bold, textTransform: 'uppercase', marginBottom: 8 },
  pickerFake: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, marginBottom: 20 },
  pickerText: { color: colors.white, fontSize: typography.size.sm },
  textArea: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, color: colors.white, padding: 16, fontSize: typography.size.sm, minHeight: 120 },
  
  locationRow: { flexDirection: 'row', gap: 12 },
  inputIconWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 12 },
  inputIcon: { marginRight: 8 },
  inputWithIcon: { flex: 1, color: colors.white, paddingVertical: 14, fontSize: typography.size.sm },
  detectBtn: { backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  detectBtnText: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.medium },

  evidenceRow: { flexDirection: 'row', gap: 12 },
  evidenceBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed', borderRadius: 12, height: 100, alignItems: 'center', justifyContent: 'center', gap: 8 },
  evidenceBtnText: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },
  
  imagesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  thumbnail: { width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },

  reviewAlert: { flexDirection: 'row', gap: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)', marginBottom: 24 },
  reviewAlertContent: { flex: 1 },
  reviewAlertTitle: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.bold, marginBottom: 4 },
  reviewAlertText: { color: colors.slate300, fontSize: typography.size.sm, lineHeight: 20 },

  reviewBox: { backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20 },
  reviewBoxTitle: { color: colors.slate400, fontSize: typography.size.xs, fontWeight: typography.weight.bold, textTransform: 'uppercase', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  reviewItem: { marginBottom: 16 },
  reviewItemLabel: { color: colors.slate500, fontSize: typography.size.xs, marginBottom: 4 },
  reviewItemValue: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.medium },

  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  footerBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  footerBtnHidden: { opacity: 0 },
  footerBtnText: { color: colors.slate300, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },
  footerBtnPrimary: { backgroundColor: colors.primary },
  footerBtnPrimaryText: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },

  predictionBox: { backgroundColor: 'rgba(59, 130, 246, 0.05)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)', borderRadius: 16, padding: 20 },
  predictionBoxTitle: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.bold, marginBottom: 12 },
  predictionErrorText: { color: colors.error, fontSize: typography.size.sm, marginBottom: 12 },
  predictionQueuedText: { color: colors.primaryLight, fontSize: typography.size.sm, marginBottom: 12 },
  predictionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  predictionItem: { width: '47%', marginBottom: 8 },
  predictionItemFull: { width: '100%', marginBottom: 8 },
  predictionItemLabel: { color: colors.slate400, fontSize: typography.size.xs, marginBottom: 4 },
  predictionItemValue: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.medium },
});
