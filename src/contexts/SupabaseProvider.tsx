import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext } from "react";

const client = createClient(
    "https://dzmjmzyejykmiltwckdy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6bWptenllanlrbWlsdHdja2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MDA1OTAsImV4cCI6MjA0ODk3NjU5MH0.ITUMvXIhTnoCFFflc59OJK3uIfHGRvw6Z10ylWymNfk",
);

export const SupabaseContext = createContext<SupabaseClient>(client);

const SupabaseProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <SupabaseContext.Provider value={client}>
            {children}
        </SupabaseContext.Provider>
    );
};

export const useSupabase = () => useContext(SupabaseContext);

export default SupabaseProvider;
