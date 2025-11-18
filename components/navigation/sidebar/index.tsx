"use client";

import {
  Calendar,
  LayoutDashboard,
  User,
  Contact,
  UserCog,
  ChevronDown,
  BookCopy,
  Notebook,
  NotepadText,
  FileUp,
  MailPlus,
  FileText,
  DiamondPercent,
} from "lucide-react";

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
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { MdFiberSmartRecord } from "react-icons/md";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Menu items Akademics
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
];

// Menu Layanan Akademics
const menu_layanan_akademic = [
  { title: "Kurikulum", url: "#", icon: BookCopy },
  { title: "Jadwal Perkuliahan", url: "#", icon: Calendar },
  { title: "Kartu Rencana Semester", url: "#", icon: Notebook },
  { title: "Kartu Hasil Studi", url: "#", icon: NotepadText },
  { title: "Unggah Nilai Mata Kuliah", url: "#", icon: FileUp },
];

// Civitas Akademic
const menu_civitas_akademic = [
  { title: "Dosen", url: "#", icon: Contact },
  { title: "Mahasiswa", url: "#", icon: User },
  { title: "Tenaga Pendidikan", url: "#", icon: UserCog },
  { title: "Alumni", url: "#", icon: UserCog },
];

// Surat dan Administrasi
// Layanan Akademik
const menu_layanan_administrasi = [
  { title: "Permohonan Surat", url: "#", icon: MailPlus },
  { title: "SK dan Surat Tugas Dosen", url: "#", icon: FileText },
];

// Layanan Akademik
const menu_keuangan = [
  { title: "Tunggakan Mahasiswa", url: "#", icon: DiamondPercent },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-gray-200" collapsible="icon">
      <SidebarHeader className="border-b border-gray-200">
        <MdFiberSmartRecord className="w-[40px] h-[40px] text-violet-900" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Insight</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="hover:bg-violet-900 rounded-lg hover:text-white "
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className="text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="hover:bg-violet-50 hover:text-violet-900 hover:border hover:border-violet-900">
                Layanan Akademik
                <ChevronDown className="ml-auto  transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menu_layanan_akademic.map((item) => (
                    <SidebarMenuItem
                      key={item.title}
                      className="hover:bg-violet-100 rounded-lg hover:text-gray-800 hover:border hover:border-violet-800 "
                    >
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span className="text-sm">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="hover:bg-violet-50 hover:text-violet-900 hover:border hover:border-violet-900">
                Sumber Daya Manusia
                <ChevronDown className="ml-auto  transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menu_civitas_akademic.map((item) => (
                    <SidebarMenuItem
                      key={item.title}
                      className="hover:bg-violet-900 rounded-lg hover:text-white "
                    >
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span className="text-sm">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="hover:bg-violet-50 hover:text-violet-900 hover:border hover:border-violet-900">
                Administrasi
                <ChevronDown className="ml-auto  transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menu_layanan_administrasi.map((item) => (
                    <SidebarMenuItem
                      key={item.title}
                      className="hover:bg-violet-900 rounded-lg hover:text-white "
                    >
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span className="text-sm">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="hover:bg-violet-50 hover:text-violet-900 hover:border hover:border-violet-900">
                Keuangan
                <ChevronDown className="ml-auto  transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenuSub>
                  {menu_keuangan.map((item) => (
                    <SidebarMenuSubItem
                      key={item.title}
                      className="hover:bg-violet-900 rounded-lg hover:text-white "
                    >
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span className="text-sm">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  );
}
