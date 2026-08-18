"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";


export function useUserRole() {

  const [role, setRole] =
    useState<string | null>(null);


  const [loading, setLoading] =
    useState(true);



  useEffect(() => {

    async function loadRole() {


      const {
        data:{
          user
        }
      } =
      await supabase.auth.getUser();



      if(!user){

        setLoading(false);

        return;

      }



      const {
        data:profile,
        error
      } =
      await supabase

        .from("profiles")

        .select("role")

        .eq(
          "id",
          user.id
        )

        .single();



      if(
        !error &&
        profile
      ){

        setRole(
          profile.role
        );

      }



      setLoading(false);

    }



    loadRole();


  }, []);



  return {

    role,

    loading,

  };

}