"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star } from "lucide-react";
import supabase from "@/lib/supabase";

function RateUserPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const { id } = useParams();
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const { data: userData, error: userError } = await supabase
          .from("usersvisible")
          .select("uid, \"Display Name\"")
          .eq("uid", id)
          .maybeSingle();

        if (userError) throw userError;
        if (!userData) throw new Error("User not found");

        setUserData(userData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  // Handle rating submission
  const handleRateUser = async () => {
    // Check if a rating is selected
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    // Check if the comment has at least 20 characters
    if (comment.length < 20) {
      alert("Please write a comment with at least 20 characters.");
      return;
    }

    try {
      // Get the current authenticated user's ID
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error("User not authenticated.");

      // Insert the rating into the `ratings` table
      const { error } = await supabase
        .from("ratings")
        .insert([{ 
          user_id: id, // ID of the user being rated
          rater_id: user.id, // ID of the authenticated user submitting the rating
          rating, // Rating value (1-5)
          comment // Optional comment
        }]);

      if (error) throw error;

      // Update the `usersvisible` table to set `shouldrate` to false and `id_to_rate` to null
      const { error: updateError } = await supabase
        .from('usersvisible')
        .update({ shouldrate: false, id_to_rate: null })
        .eq('uid', id);

      if (updateError) throw updateError;

      // Success message and redirect
      alert("Rating submitted successfully!");
      router.push("/"); // Redirect to home or another page after submission
    } catch (err: any) {
      setError(err.message);
      alert("Failed to submit rating: " + err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* White Box */}
        <div className="backdrop-blur-sm rounded-3xl shadow-xl p-8 border bg-white border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Ocenite svoje iskustvo sa korisnikom:{" "}
            <span className="text-green-600">{userData?.["Display Name"]}</span>
          </h1>

          {/* Rating Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ocena (1-5 zvezdica)</h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-full transition-colors ${
                    rating >= star
                      ? "text-green-600 fill-green-600" // Filled green star
                      : "text-gray-300 fill-gray-300" // Unfilled gray star
                  } hover:text-green-600 hover:fill-green-600`}
                >
                  <Star className="w-8 h-8" />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Komentar</h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 rounded-2xl border border-gray-200 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
              placeholder="Opisite svoje iskustvo... (minimalno 20 karaktera)"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleRateUser}
            className="w-full bg-green-500 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-green-600 transition-colors"
          >
            Oceni
          </button>
        </div>
      </div>
    </div>
  );
}

export default RateUserPage;