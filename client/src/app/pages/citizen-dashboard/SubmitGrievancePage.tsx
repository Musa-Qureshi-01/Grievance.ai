import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Send, UploadCloud, Info } from "lucide-react";
import { Button } from "../../components/ui/button";

type UploadItem = {
    file: File;
    url: string;
};

export function SubmitGrievance() {
    const [step, setStep] = useState(1);
    const today = new Date().toISOString().split("T")[0];

    const [location, setLocation] = useState("");
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    const [uploads, setUploads] = useState<UploadItem[]>([]);
    const [imageError, setImageError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            uploads.forEach((u) => URL.revokeObjectURL(u.url));
        };
    }, [uploads]);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported in this browser.");
            return;
        }
        setIsLocating(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                setIsLocating(false);
            },
            () => {
                setLocationError(
                    "Unable to detect location. Please allow permission.",
                );
                setIsLocating(false);
            },
            { timeout: 8000, enableHighAccuracy: true },
        );
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const maxFiles = 5;
        const maxSizeMb = 10;

        const filtered = files.filter((f) => f.size <= maxSizeMb * 1024 * 1024);

        if (files.length > maxFiles) {
            setImageError(`Max ${maxFiles} images allowed.`);
        } else if (filtered.length !== files.length) {
            setImageError(`Each file must be under ${maxSizeMb}MB.`);
        } else {
            setImageError(null);
        }

        setUploads((prev) => {
            const remaining = maxFiles - prev.length;
            const next = filtered.slice(0, remaining).map((file) => ({
                file,
                url: URL.createObjectURL(file),
            }));
            return [...prev, ...next];
        });

        // Allow re-selecting the same file
        e.currentTarget.value = "";
    };

    const removeImage = (index: number) => {
        setUploads((prev) => {
            const next = [...prev];
            const [removed] = next.splice(index, 1);
            if (removed) URL.revokeObjectURL(removed.url);
            return next;
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 font-inter">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Official Grievance Form
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Please provide accurate details. False reporting may result
                    in civic penalties.
                </p>
            </div>

            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
                {/* Progress Bar */}
                <div className="bg-slate-50/50 dark:bg-slate-800/50 px-8 py-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                step >= 1
                                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                    : "bg-slate-200 text-slate-500 dark:bg-slate-700"
                            }`}
                        >
                            1
                        </div>
                        <span
                            className={`text-sm font-semibold uppercase tracking-wider ${
                                step >= 1
                                    ? "text-slate-900 dark:text-white"
                                    : "text-slate-500"
                            }`}
                        >
                            Classification
                        </span>
                    </div>
                    <div className="h-px flex-1 mx-6 bg-slate-200 dark:bg-slate-700">
                        <div
                            className={`h-full bg-blue-600 transition-all ${
                                step >= 2 ? "w-full" : "w-0"
                            }`}
                        ></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                step >= 2
                                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                    : "bg-slate-200 text-slate-500 dark:bg-slate-700"
                            }`}
                        >
                            2
                        </div>
                        <span
                            className={`text-sm font-semibold uppercase tracking-wider ${
                                step >= 2
                                    ? "text-slate-900 dark:text-white"
                                    : "text-slate-500"
                            }`}
                        >
                            Evidence
                        </span>
                    </div>
                    <div className="h-px flex-1 mx-6 bg-slate-200 dark:bg-slate-700">
                        <div
                            className={`h-full bg-blue-600 transition-all ${
                                step >= 3 ? "w-full" : "w-0"
                            }`}
                        ></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                step >= 3
                                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                    : "bg-slate-200 text-slate-500 dark:bg-slate-700"
                            }`}
                        >
                            3
                        </div>
                        <span
                            className={`text-sm font-semibold uppercase tracking-wider ${
                                step >= 3
                                    ? "text-slate-900 dark:text-white"
                                    : "text-slate-500"
                            }`}
                        >
                            Review
                        </span>
                    </div>
                </div>

                <div className="p-8">
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-3">
                                            Primary Category
                                        </label>
                                        <select className="w-full px-4 py-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                                            <option>
                                                Infrastructure & Roads
                                            </option>
                                            <option>Sanitation & Waste</option>
                                            <option>
                                                Public Safety & Police
                                            </option>
                                            <option>Water & Utilities</option>
                                            <option>Civic Services</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                                            Sub-Category
                                        </label>
                                        <select className="w-full px-4 py-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                                            <option>
                                                Pothole / Road Damage
                                            </option>
                                            <option>Broken Streetlight</option>
                                            <option>
                                                Traffic Signal Malfunction
                                            </option>
                                            <option>Sidewalk Blockage</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                                            Date of Observation
                                        </label>
                                        <input
                                            type="date"
                                            min={today}
                                            className="w-full px-4 py-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                                            Detailed Description
                                        </label>
                                        <textarea
                                            rows={10}
                                            placeholder="Provide specific details. E.g., 'The pothole is roughly 2 feet wide and located in the right lane...'"
                                            className="w-full px-4 py-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm resize-none"
                                        ></textarea>
                                        <p className="text-[10px] text-slate-500 mt-1">
                                            Minimum 50 characters required for
                                            automated analysis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                                        Location Coordinates
                                    </label>
                                    <div className="relative mb-2 flex gap-2 items-center">
                                        <div className="relative flex-1">
                                            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Enter exact street address or coordinates..."
                                                value={location}
                                                onChange={(e) =>
                                                    setLocation(e.target.value)
                                                }
                                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDetectLocation}
                                            className="shrink-0 w-[100px] h-[40px] px-4 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                                        >
                                            {isLocating
                                                ? "Detecting..."
                                                : "Detect"}
                                        </Button>
                                    </div>
                                    {locationError && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {locationError}
                                        </p>
                                    )}

                                    <div className="w-full h-[240px] bg-slate-100 dark:bg-slate-950 rounded-md border border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden shadow-inner mt-4">
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                                        <div className="text-center z-10 flex flex-col items-center">
                                            <MapPin className="w-6 h-6 text-blue-500 mb-2" />
                                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Geospatial Locator Active
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col h-full">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                                        Photographic Evidence
                                    </label>

                                    {/* Clickable upload area */}
                                    <label className="flex-1 w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors cursor-pointer bg-white dark:bg-slate-900">
                                        <UploadCloud className="w-8 h-8 text-blue-600 mb-3" />
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Upload High-Res Photos
                                        </span>
                                        <span className="text-xs text-slate-500 mt-2 max-w-xs">
                                            Geo-tagged photos will be
                                            automatically verified by the
                                            Intelligence Center. Max 5 files.
                                        </span>

                                        {/* Hidden input: entire area triggers this */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>

                                    {imageError && (
                                        <p className="text-xs text-red-500 mt-2">
                                            {imageError}
                                        </p>
                                    )}

                                    {uploads.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            {uploads.map((item, idx) => (
                                                <div
                                                    key={`${item.file.name}-${item.file.lastModified}`}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={item.url}
                                                        alt={`preview-${idx}`}
                                                        className="w-full h-24 object-cover rounded-md border border-slate-200 dark:border-slate-800"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeImage(idx)
                                                        }
                                                        className="absolute top-1 right-1 size-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80"
                                                        aria-label="Remove image"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-md flex gap-4 items-start shadow-sm">
                                <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                                        Automated Triage Complete
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                                        Based on your input and historical data,
                                        this report has been classified as{" "}
                                        <strong>Severity Level 2</strong>. Upon
                                        submission, it will be immediately
                                        queued for the{" "}
                                        <strong>
                                            Public Works (Infrastructure)
                                            Division
                                        </strong>
                                        .
                                    </p>
                                </div>
                            </div>

                            <div className="border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 p-6 space-y-4 shadow-sm">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
                                    Final Review
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                                    <div>
                                        <span className="block text-slate-500 text-xs mb-1">
                                            Category
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            Infrastructure & Roads
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-500 text-xs mb-1">
                                            Sub-Category
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            Pothole / Road Damage
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="block text-slate-500 text-xs mb-1">
                                            Location
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {location ||
                                                "124 Main Street, Downtown"}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="block text-slate-500 text-xs mb-1">
                                            Images
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {uploads.length
                                                ? `${uploads.length} attached`
                                                : "None"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="p-6 bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setStep(Math.max(1, step - 1))}
                        className={`rounded-md text-sm font-semibold shadow-sm ${
                            step === 1 ? "invisible" : ""
                        }`}
                    >
                        Back
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 text-sm font-semibold shadow-md shadow-blue-500/20"
                        onClick={() => {
                            if (step < 3) setStep(step + 1);
                            else
                                alert(
                                    "Official Grievance Submitted Successfully.",
                                );
                        }}
                    >
                        {step === 3 ? (
                            <>
                                Submit Complaint <Send className="w-4 h-4 ml-2" />
                            </>
                        ) : (
                            "Proceed to Next Section"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
