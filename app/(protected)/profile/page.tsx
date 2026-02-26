"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  setLoading,
  setProfileData,
  setError,
} from "../../redux/slices/profileSlice";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { name, email, role, createdAt, loading, error } =
    useSelector((state: RootState) => state.profile);

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      dispatch(setLoading(true));

      try {
        const res = await fetch("/api/student/profile", {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          dispatch(setError(data?.message || "Failed to load profile"));
          return;
        }

        if (!ignore) {
          dispatch(
            setProfileData({
              name: data.name,
              email: data.email,
              role: data.role,
              createdAt: data.createdAt,
            })
          );
        }
      } catch {
        if (!ignore) {
          dispatch(setError("Failed to load profile"));
        }
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [dispatch]);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Profile
        </h2>
        <p className="text-gray-600">
          View your account details
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-lg font-medium text-gray-900">
            {name || "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium text-gray-900">
            {email || "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="text-lg font-medium text-gray-900 capitalize">
            {role || "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Account Created</p>
          <p className="text-lg font-medium text-gray-900">
            {formattedDate || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
