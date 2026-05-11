'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Megaphone,
    Gavel,
    CalendarDays,
    FileText,
    Coins,
    BookOpen,
    Package,
    LogOut,
    ChevronUp,
    User2,
    Target,
    AlertTriangle,
    Handshake,
    Wallet,
    FileBarChart,
    Lightbulb,
    Users,
    Scale,
    TrendingUp,
    ClipboardList,
    BarChart3,
    Receipt,
    SmilePlus,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// ─────────────────────────────────────────────
// Definisi grup navigasi
// ─────────────────────────────────────────────
const navGroups = [
    {
        label: 'Utama',
        items: [
            {
                label: 'Dashboard',
                icon: LayoutDashboard,
                href: '/',
                color: 'text-sky-400',
                activeColor: 'border-sky-400',
            },
        ],
    },
    {
        label: 'Persidangan',
        items: [
            {
                label: 'Panggilan Ghaib',
                icon: Megaphone,
                href: '/panggilan',
                color: 'text-violet-400',
                activeColor: 'border-violet-400',
            },
            {
                label: 'Data Itsbat',
                icon: Scale,
                href: '/itsbat',
                color: 'text-pink-400',
                activeColor: 'border-pink-400',
            },
            {
                label: 'Panggilan e-Court',
                icon: Gavel,
                href: '/panggilan-ecourt',
                color: 'text-emerald-400',
                activeColor: 'border-emerald-400',
            },
            {
                label: 'Agenda Pimpinan',
                icon: CalendarDays,
                href: '/agenda',
                color: 'text-red-400',
                activeColor: 'border-red-400',
            },
        ],
    },
    {
        label: 'Keuangan & Aset',
        items: [
            {
                label: 'Realisasi Anggaran',
                icon: TrendingUp,
                href: '/anggaran',
                color: 'text-green-400',
                activeColor: 'border-green-400',
            },
            {
                label: 'DIPA & POK',
                icon: BookOpen,
                href: '/dipapok',
                color: 'text-blue-400',
                activeColor: 'border-blue-400',
            },
            {
                label: 'Keuangan Perkara',
                icon: Coins,
                href: '/keuangan-perkara',
                color: 'text-teal-400',
                activeColor: 'border-teal-400',
            },
            {
                label: 'Sisa Panjar',
                icon: Wallet,
                href: '/sisa-panjar',
                color: 'text-orange-400',
                activeColor: 'border-orange-400',
            },
            {
                label: 'Aset & BMN',
                icon: Package,
                href: '/aset-bmn',
                color: 'text-cyan-400',
                activeColor: 'border-cyan-400',
            },
            {
                label: 'LRA',
                icon: FileBarChart,
                href: '/lra',
                color: 'text-indigo-400',
                activeColor: 'border-indigo-400',
            },
        ],
    },
    {
        label: 'Administrasi',
        items: [
            {
                label: 'LHKPN & SPT',
                icon: FileText,
                href: '/lhkpn',
                color: 'text-amber-400',
                activeColor: 'border-amber-400',
            },
            {
                label: 'SAKIP',
                icon: Target,
                href: '/sakip',
                color: 'text-purple-400',
                activeColor: 'border-purple-400',
            },
            {
                label: 'Laporan Pengaduan',
                icon: AlertTriangle,
                href: '/laporan-pengaduan',
                color: 'text-rose-400',
                activeColor: 'border-rose-400',
            },
            {
                label: 'MOU',
                icon: Handshake,
                href: '/mou',
                color: 'text-sky-400',
                activeColor: 'border-sky-400',
            },
            {
                label: 'Mediasi',
                icon: ClipboardList,
                href: '/mediasi',
                color: 'text-lime-400',
                activeColor: 'border-lime-400',
            },
            {
                label: 'Survey',
                icon: SmilePlus,
                href: '/survey',
                color: 'text-fuchsia-400',
                activeColor: 'border-fuchsia-400',
            },
        ],
    },
    {
        label: 'Profil & Inovasi',
        items: [
            {
                label: 'Uraian Tugas',
                icon: Users,
                href: '/uraian-tugas',
                color: 'text-teal-400',
                activeColor: 'border-teal-400',
            },
            {
                label: 'Inovasi',
                icon: Lightbulb,
                href: '/inovasi',
                color: 'text-yellow-400',
                activeColor: 'border-yellow-400',
            },
        ],
    },
];

// ─────────────────────────────────────────────
// Komponen Sidebar
// ─────────────────────────────────────────────
export function AppSidebar() {
    const pathname = usePathname();

    // Cek apakah path aktif (support sub-routes)
    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname === href || pathname.startsWith(href + '/');
    };

    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-slate-800">

            {/* ── HEADER ── */}
            <SidebarHeader className="bg-slate-950 text-white border-b border-slate-800/50 p-4">
                <div className="flex items-center gap-3 px-1 py-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-900/40 shrink-0">
                        <Scale className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-0 group-data-[collapsible=icon]:hidden">
                        <span className="font-bold text-sm tracking-wide text-white">PA Penajam</span>
                        <span className="text-[10px] text-slate-400 font-medium">Admin Workspace</span>
                    </div>
                </div>
            </SidebarHeader>

            {/* ── CONTENT ── */}
            <SidebarContent className="bg-slate-950 text-white overflow-y-auto">
                {navGroups.map((group, groupIdx) => (
                    <div key={group.label}>
                        {groupIdx > 0 && (
                            <div className="h-px bg-slate-800/60 mx-3 my-0" />
                        )}
                        <SidebarGroup className="py-1.5">
                            <SidebarGroupLabel className="
                                text-slate-500 uppercase text-[10px] font-bold tracking-widest
                                px-3 py-1.5 mb-0.5
                                group-data-[collapsible=icon]:hidden
                            ">
                                {group.label}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((item) => {
                                        const active = isActive(item.href);
                                        return (
                                            <SidebarMenuItem key={item.href}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={active}
                                                    tooltip={item.label}
                                                    className={`
                                                        h-9 rounded-lg mx-1
                                                        text-slate-400 hover:text-white
                                                        hover:bg-slate-800/70
                                                        transition-all duration-150
                                                        data-[active=true]:bg-slate-800
                                                        data-[active=true]:text-white
                                                        border-l-2 border-transparent
                                                        data-[active=true]:${item.activeColor}
                                                    `}
                                                >
                                                    <Link href={item.href} className="flex gap-2.5 items-center pl-2">
                                                        <item.icon className={`h-[15px] w-[15px] shrink-0 ${active ? item.color : 'text-slate-500 group-hover:text-slate-300'}`} />
                                                        <span className={`text-[13px] font-medium ${active ? 'text-white' : ''}`}>
                                                            {item.label}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </div>
                ))}
            </SidebarContent>

            {/* ── FOOTER ── */}
            <SidebarFooter className="bg-slate-950 border-t border-slate-800/50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-slate-800 data-[state=open]:text-white hover:bg-slate-800 hover:text-white text-slate-300"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg shrink-0">
                                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
                                            AD
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                        <span className="truncate font-semibold text-white text-xs">Admin Pengadilan</span>
                                        <span className="truncate text-[10px] text-slate-400">admin@pa-penajam.go.id</span>
                                    </div>
                                    <ChevronUp className="ml-auto size-3.5 text-slate-500 group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-52 rounded-lg bg-slate-900 border-slate-800 text-white"
                            >
                                <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer gap-2 text-slate-300">
                                    <User2 className="h-4 w-4 text-slate-400" />
                                    <span>Profile Saya</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-red-900/50 focus:text-red-200 cursor-pointer gap-2 text-red-400">
                                    <LogOut className="h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
