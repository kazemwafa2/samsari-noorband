"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardHeader from "./components/DashboardHeader";
import StatsCards from "./components/StatsCards";
import RecentOrders from "./components/RecentOrders";
import ProductOverview from "./components/ProductOverview";
import UserOverview from "./components/UserOverview";
import SalesChart from "./components/SalesChart";
import DashboardMenu from "./components/DashboardMenu";

import { checkAdmin } from "@/lib/check-admin";


export default function Dashboard() {


const router = useRouter();

const [loading,setLoading] = useState(true);

const [allowed,setAllowed] = useState(false);



useEffect(()=>{


async function verifyAdmin(){


const result = await checkAdmin();


if(!result){

router.push("/login");

return;

}


setAllowed(true);

setLoading(false);


}



verifyAdmin();


},[router]);




if(loading){

return (

<main className="home-page">

<h1 className="section-title">

⏳ بررسی دسترسی...

</h1>

</main>

);

}




if(!allowed){

return null;

}



return (

<main className="home-page space-y-6">


<DashboardHeader />


<h1 className="section-title">
⚙️ پنل مدیریت نوربند
</h1>



<StatsCards />



<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">


<RecentOrders />

<ProductOverview />


<UserOverview />


<SalesChart />


</div>



<DashboardMenu />



</main>

);

}