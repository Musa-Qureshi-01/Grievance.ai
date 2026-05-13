import { motion } from "motion/react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import {
    Plus,
    Search,
    MapPin,
    Clock,
    CheckCircle2,
    Download,
    AlertCircle,
    Trophy,
    Eye,
    Trash2,
    X,
    Send,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useCurrentUser } from "../../../hooks/useAuth";
import { complaintService } from "../../../services/complaint.service";

export function CitizenOverview() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
    const [feedbackRating, setFeedbackRating] = useState(5);
    const [feedbackReview, setFeedbackReview] = useState("");
    const { data: user } = useCurrentUser();
    const { data } = useQuery({
        queryKey: ["complaints", "mine", searchTerm],
        queryFn: () => complaintService.list({ page: 1, limit: 20, search: searchTerm || undefined }),
        refetchInterval: 15000,
    });
    const { data: selectedComplaint, isFetching: isLoadingDetails } = useQuery({
        queryKey: ["complaints", "detail", selectedComplaintId],
        queryFn: () => complaintService.getById(selectedComplaintId as string),
        enabled: Boolean(selectedComplaintId),
        refetchInterval: selectedComplaintId ? 15000 : false,
    });
    const deleteMutation = useMutation({
        mutationFn: complaintService.delete,
        onSuccess: (_, deletedId) => {
            toast.success("Complaint deleted");
            if (selectedComplaintId === deletedId) setSelectedComplaintId(null);
            queryClient.invalidateQueries({ queryKey: ["complaints", "mine"] });
            queryClient.invalidateQueries({ queryKey: ["citizen", "profile"] });
        },
    });
    const feedbackMutation = useMutation({
        mutationFn: ({ id, rating, review }: { id: string; rating: number; review: string }) =>
            complaintService.addFeedback(id, { rating, review }),
        onSuccess: () => {
            toast.success("Feedback shared with officer");
            setFeedbackReview("");
            queryClient.invalidateQueries({ queryKey: ["complaints", "detail", selectedComplaintId] });
            queryClient.invalidateQueries({ queryKey: ["complaints", "mine"] });
        },
    });
    const complaints = data?.items ?? [];
    const activeCount = complaints.filter((item) => !["RESOLVED", "CLOSED", "REJECTED"].includes(item.status)).length;
    const resolvedCount = complaints.filter((item) => ["RESOLVED", "CLOSED"].includes(item.status)).length;
    const selectedModel1 = useMemo(
        () => selectedComplaint?.aiModelOutputs?.find((output) => output.modelName === "MODEL_1_AUTHENTICITY_PRIORITY"),
        [selectedComplaint],
    );
    const selectedPrediction = useMemo(() => {
        const savedPrediction = selectedComplaint?.predictions?.[0];
        if (savedPrediction) return savedPrediction;

        if (selectedModel1) {
            const processed = selectedModel1.processedOutput || {};
            return {
                validity: (processed.validity as string | undefined) || selectedModel1.classification,
                priority: (processed.priority as string | undefined) || selectedModel1.priorityLevel,
                trustScore: processed.trustScore as number | string | null | undefined,
            };
        }

        return null;
    }, [selectedComplaint, selectedModel1]);
    const selectedModel2 = useMemo(
        () => selectedComplaint?.aiModelOutputs?.find((output) => output.modelName === "MODEL_2_CLASSIFICATION_SEVERITY"),
        [selectedComplaint],
    );
    const isCompletedStatus = (status: string) => ["RESOLVED", "CLOSED"].includes(status);

    const handleDelete = (id: string) => {
        const confirmed = window.confirm("Delete this complaint permanently?");
        if (!confirmed) return;
        deleteMutation.mutate(id);
    };

    const downloadWorkReport = async (id: string) => {
        const blob = await complaintService.downloadWorkReport(id);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `work-report-${id}.html`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Welcome back, {user?.name || "Citizen"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Track your community reports and civic requests.
                    </p>
                </div>
                <Link to="/citizen-dashboard/submit">
                    <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-md px-6 shadow-md">
                        <Plus className="w-4 h-4 mr-2" />
                        File New Report
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                            Active Issues
                        </span>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">
                        {activeCount}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                            Resolved
                        </span>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">
                        {resolvedCount}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                            Community Rank
                        </span>
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                            <Trophy className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">
                        {data?.pagination?.total ? `#${data.pagination.total}` : "Pending"}
                    </div>
                </motion.div>
            </div>

            {/* Complaints List */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Your Reports
                    </h2>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="pl-9 pr-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-md text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none w-full sm:w-64 transition-shadow"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {complaints.map((complaint, idx) => (
                        <motion.div
                            key={complaint.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="group p-6 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
                            onClick={() => setSelectedComplaintId(complaint.id)}
                        >
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            {complaint.id}
                                        </span>
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-md border ${
                                                ["RESOLVED", "CLOSED"].includes(complaint.status)
                                                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                                    : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                            }`}
                                        >
                                            {complaint.status.replaceAll("_", " ")}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
                                        {complaint.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            {complaint.department?.name || "Unassigned"}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end justify-between pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                                    <div className="text-sm text-slate-500 dark:text-slate-400 sm:text-right">
                                        <div className="text-xs mb-1 uppercase tracking-wider font-semibold">
                                            Routed to
                                        </div>
                                        <div className="font-medium text-slate-900 dark:text-slate-300 flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-md bg-blue-500"></div>
                                            {complaint.department?.name || "Pending routing"}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedComplaintId(complaint.id);
                                        }}
                                    >
                                        <Eye className="w-3.5 h-3.5 mr-1" />
                                        View Details
                                    </Button>
                                    {isCompletedStatus(complaint.status) ? (
                                        <div className="mt-2 inline-flex items-center rounded-md bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                            Work Complete
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                            disabled={deleteMutation.isPending}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleDelete(complaint.id);
                                            }}
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {!complaints.length && (
                        <div className="p-8 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
                            No complaints found.
                        </div>
                    )}
                </div>
            </div>

            {selectedComplaintId && (
                <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Complaint Details
                                </p>
                                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                    {selectedComplaint?.title || "Loading complaint..."}
                                </h3>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedComplaintId(null)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="p-5 space-y-5">
                            {isLoadingDetails && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">Loading details...</p>
                            )}
                            {selectedComplaint && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                                            <span className="block text-xs text-slate-500">Status</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {selectedComplaint.status.replaceAll("_", " ")}
                                            </span>
                                        </div>
                                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                                            <span className="block text-xs text-slate-500">Priority</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {selectedComplaint.priority}
                                            </span>
                                        </div>
                                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                                            <span className="block text-xs text-slate-500">Department</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {selectedComplaint.department?.name || "Pending routing"}
                                            </span>
                                        </div>
                                    </div>

                                    {(selectedComplaint as any).assignedOfficer?.name && (
                                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                                            <span className="block text-xs text-slate-500">Assigned Officer</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {(selectedComplaint as any).assignedOfficer.name}
                                            </span>
                                        </div>
                                    )}

                                    <div>
                                        <span className="block text-xs font-semibold text-slate-500 mb-2">Tracking ID</span>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 break-all">
                                            {selectedComplaint.id}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="block text-xs font-semibold text-slate-500 mb-2">Report</span>
                                        <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-sm text-slate-700 dark:text-slate-300 font-sans">
                                            {selectedComplaint.description}
                                        </pre>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                                            <span className="block text-xs text-slate-500">Validity</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {selectedPrediction?.validity || "AI processing"}
                                            </span>
                                        </div>
                                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                                            <span className="block text-xs text-slate-500">AI Priority</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {selectedPrediction?.priority || "AI processing"}
                                            </span>
                                        </div>
                                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                                            <span className="block text-xs text-slate-500">Trust Score</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {selectedPrediction?.trustScore ?? "AI processing"}
                                            </span>
                                        </div>
                                    </div>

                                    {selectedModel2 && (
                                        <div className="rounded-lg border border-cyan-200 bg-cyan-50/60 dark:border-cyan-900/40 dark:bg-cyan-950/20 p-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div>
                                                    <span className="block text-xs text-slate-500">Estimated resolution</span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {selectedModel2.estimatedResolutionHours ?? "Pending"}h
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-slate-500">AI department</span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {selectedModel2.suggestedDepartment || "Pending"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-slate-500">Risk category</span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {selectedModel2.riskCategory || "Standard"}
                                                    </span>
                                                </div>
                                            </div>
                                            {selectedModel2.aiRecommendation && (
                                                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                                                    {selectedModel2.aiRecommendation}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <span className="block text-xs font-semibold text-slate-500 mb-3">Timeline</span>
                                        <div className="space-y-3">
                                            {(selectedComplaint.statusHistory || []).map((entry) => (
                                                <div key={entry.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {entry.newStatus.replaceAll("_", " ")}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            {new Date(entry.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {entry.changedBy?.name && (
                                                        <p className="mt-1 text-xs font-semibold text-slate-500">
                                                            Updated by {entry.changedBy.name}
                                                        </p>
                                                    )}
                                                    {entry.note && (
                                                        <p className="mt-1 text-xs text-slate-500">{entry.note}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {!!selectedComplaint.attachments?.length && (
                                        <div>
                                            <span className="block text-xs font-semibold text-slate-500 mb-3">Live Work Images</span>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {selectedComplaint.attachments.map((attachment) => (
                                                    <a
                                                        key={attachment.id}
                                                        href={attachment.fileUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="block overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
                                                    >
                                                        <img
                                                            src={attachment.fileUrl}
                                                            alt={attachment.fileName || "work progress"}
                                                            className="h-28 w-full object-cover"
                                                        />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                Citizen Feedback
                                            </span>
                                            <select
                                                value={feedbackRating}
                                                onChange={(event) => setFeedbackRating(Number(event.target.value))}
                                                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
                                            >
                                                {[5, 4, 3, 2, 1].map((rating) => (
                                                    <option key={rating} value={rating}>{rating}/5</option>
                                                ))}
                                            </select>
                                        </div>
                                        <textarea
                                            value={feedbackReview}
                                            onChange={(event) => setFeedbackReview(event.target.value)}
                                            placeholder="Share feedback for the assigned officer..."
                                            className="mt-3 min-h-20 w-full resize-none rounded-md border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                        />
                                        <div className="mt-3 flex justify-between gap-3">
                                            <div className="space-y-2 text-xs text-slate-500">
                                                {(selectedComplaint.feedback || []).map((item) => (
                                                    <p key={item.id}>
                                                        {item.rating}/5 {item.review || "No written review"}
                                                    </p>
                                                ))}
                                            </div>
                                            <Button
                                                size="sm"
                                                disabled={feedbackMutation.isPending}
                                                onClick={() => feedbackMutation.mutate({
                                                    id: selectedComplaint.id,
                                                    rating: feedbackRating,
                                                    review: feedbackReview,
                                                })}
                                            >
                                                <Send className="mr-2 h-4 w-4" />
                                                Send
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button variant="outline" onClick={() => downloadWorkReport(selectedComplaint.id)}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Report
                                        </Button>
                                        <Button variant="outline" onClick={() => setSelectedComplaintId(null)}>
                                            Close
                                        </Button>
                                        {isCompletedStatus(selectedComplaint.status) ? (
                                            <div className="inline-flex items-center rounded-md bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Work Complete
                                            </div>
                                        ) : (
                                            <Button
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                                disabled={deleteMutation.isPending}
                                                onClick={() => handleDelete(selectedComplaint.id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Complaint
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
