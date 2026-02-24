"use client";

import { useState, useEffect } from "react";
import { Star, Check, Trash2, Eye, EyeOff, RefreshCw, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  published: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/reviews");
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const togglePublish = async (id: string, published: boolean) => {
    try {
      await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, published }),
      });
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      await fetch(`/api/admin/reviews?id=${id}`, {
        method: "DELETE",
      });
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const feedbackLink = typeof window !== "undefined" ? `${window.location.origin}/feedback` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(feedbackLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingReviews = reviews.filter((r) => !r.published);
  const publishedReviews = reviews.filter((r) => r.published);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Review Dashboard</h1>
          <p className="text-muted-foreground">Manage customer reviews for your website</p>
        </div>

        {/* Feedback Link Card */}
        <Card className="mb-8 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-2">📱 Send Feedback Link to Customers</h2>
            <p className="text-sm text-muted-foreground mb-4">
              After each ride, text this link to your customer so they can leave a review:
            </p>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-white dark:bg-gray-800 rounded-lg border font-mono text-sm truncate">
                {feedbackLink}
              </div>
              <Button onClick={copyLink} variant="outline" className="shrink-0">
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" /> Copy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-500">{pendingReviews.length}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-500">{publishedReviews.length}</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={fetchReviews} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Pending Reviews */}
        {pendingReviews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                {pendingReviews.length} Pending
              </Badge>
            </h2>
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <Card key={review.id} className="border-l-4 border-l-amber-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                    </div>
                    <p className="text-muted-foreground mb-4">&ldquo;{review.text}&rdquo;</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        onClick={() => togglePublish(review.id, true)}
                      >
                        <Eye className="w-4 h-4 mr-1" /> Publish
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteReview(review.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Published Reviews */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              <Check className="w-3 h-3 mr-1" /> {publishedReviews.length} Published
            </Badge>
          </h2>
          {publishedReviews.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No published reviews yet. Approve pending reviews to show them on your website.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {publishedReviews.map((review) => (
                <Card key={review.id} className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                    </div>
                    <p className="text-muted-foreground mb-4">&ldquo;{review.text}&rdquo;</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublish(review.id, false)}
                      >
                        <EyeOff className="w-4 h-4 mr-1" /> Unpublish
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteReview(review.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {reviews.length === 0 && !loading && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p className="mb-2">No reviews yet.</p>
              <p className="text-sm">Send the feedback link to your customers after their ride!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
