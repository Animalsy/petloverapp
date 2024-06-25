import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProfileData } from "./GetProfile.thunk";
import { ContentApi } from "../../../axios";

export const updateProfile = createAsyncThunk<ProfileData['customer'], ProfileData["customer"]>(
    "profile/updateProfile",
    async (profileData, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            ContentApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            await ContentApi.put<ProfileData>(
                `/customer`,
                profileData
            )
            return profileData;
        } catch (error: any) {
            console.error(error.response.data.errors)
            return rejectWithValue(error.response.data.errors.flatMap((error: any) => error.errorMessage));
        }
    }
)