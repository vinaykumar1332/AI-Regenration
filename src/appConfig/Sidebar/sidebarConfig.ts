const sidebarConfig = {
    branding: {
        logoText: "AI Studio",
        logoTagline: "Luxury Fashion AI",
        logoImage: "venkattech_logo.png",
    },
    moduleNav: [
        {
            label: "Dashboard",
            path: "/",
            icon: "Sparkles",
            requiresAuth: false,
        },
        {
            label: "Image Generation",
            path: "/image-generation",
            icon: "Image",
            requiresAuth: true,
            children: [
                { label: "Garment Try-On", path: "/image-generation/garment-tryon", icon: "Image" },
                { label: "Single Dress Flow", path: "/image-generation/single-dress", icon: "Image" },
                //{ label: "Multi-Garment Styling", path: "/image-generation/multi-styling", icon: "Image" },
                //{ label: "Model Outfit Swap", path: "/image-generation/outfit-swap", icon: "Image" },
                //{ label: "Background Replace", path: "/image-generation/background-replace", icon: "Image" },
                // { label: "Pose Change", path: "/image-generation/pose-change", icon: "Image" },
                //{ label: "Identity Locked Portrait", path: "/image-generation/identity-portrait", icon: "Image" },
                //{ label: "E-Commerce Product Shoot", path: "/image-generation/ecommerce-shoot", icon: "Image" },
                //{ label: "Editorial Fashion Shoot", path: "/image-generation/editorial-shoot", icon: "Image" },
                //{ label: "Bulk Image Generation", path: "/image-generation/bulk", icon: "Image" },
            ],
        },
        {
            label: "Video Generation",
            path: "/video-generation",
            icon: "Video",
            requiresAuth: true,
        },
        {
            label: "Avatar Store",
            path: "/avatar-store",
            icon: "Users",
            requiresAuth: true,
        },
        {
            label: "Bulk Processing",
            path: "/bulk-processing",
            icon: "FolderSync",
            requiresAuth: true,
        },
        {
            label: "Analytics",
            path: "/analytics",
            icon: "BarChart3",
            requiresAuth: true,
        },
        {
            label: "Settings",
            path: "/settings",
            icon: "Settings",
            requiresAuth: true,
        },
    ],
};

export default sidebarConfig;
