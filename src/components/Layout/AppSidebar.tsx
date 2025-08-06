import { categories } from "@/data/menuSidebar";
import { ChevronRight, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

interface AppSidebarProps {
  onExpandedChange?: (expanded: boolean) => void;
}

export function AppSidebar({ onExpandedChange }: Readonly<AppSidebarProps>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isPinned, setIsPinned] = useState(false);
  const [submenuPosition, setSubmenuPosition] = useState<{
    top: number | "auto";
    bottom: number | "auto";
  }>({ top: 0, bottom: "auto" });
  const sidebarRef = useRef(null);
  const submenuRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Notify parent component when expanded state changes
  useEffect(() => {
    onExpandedChange?.(isExpanded);
  }, [isExpanded, onExpandedChange]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = (e) => {
    // Check if mouse is moving to submenu
    const submenu = submenuRef.current;
    if (submenu && submenu.contains(e.relatedTarget)) {
      return; // Don't collapse if moving to submenu
    }

    if (!isPinned) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
        setHoveredCategory(null);
      }, 150); // Slightly longer delay for better UX
    }
  };

  const handleSubmenuMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleSubmenuMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
      setHoveredCategory(null);
    }
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    if (!isPinned) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
      setHoveredCategory(null);
    }
  };

  const calculateSubmenuPosition = (
    categoryIndex: number,
    categoryId: string
  ) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category || !category.items)
      return { top: 0, bottom: "auto" as const };

    const headerHeight = 64; // Header height
    const categoryHeight = 52; // Approximate height of each category item
    const submenuItemHeight = 48; // Approximate height of each submenu item
    const submenuHeaderHeight = 56; // Submenu header height
    const submenuPadding = 16; // Top and bottom padding

    // Calculate estimated submenu height
    const estimatedSubmenuHeight =
      submenuHeaderHeight +
      category.items.length * submenuItemHeight +
      submenuPadding;

    // Calculate ideal top position
    const idealTop = headerHeight + categoryIndex * categoryHeight + 16;

    // Check if submenu would go off-screen
    const windowHeight = window.innerHeight;
    const submenuBottom = idealTop + estimatedSubmenuHeight;

    if (submenuBottom > windowHeight - 20) {
      // Position from bottom
      const bottomPosition = windowHeight - idealTop - categoryHeight;
      return {
        top: "auto" as const,
        bottom: Math.max(20, bottomPosition),
      };
    } else {
      // Normal positioning from top
      return {
        top: idealTop,
        bottom: "auto" as const,
      };
    }
  };

  const handleCategoryMouseEnter = (
    categoryId: string,
    categoryIndex: number
  ) => {
    setHoveredCategory(categoryId);
    const position = calculateSubmenuPosition(categoryIndex, categoryId);
    setSubmenuPosition(position);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style>{`
        /* Smooth submenu animations */
        .submenu-enter {
          opacity: 0;
          transform: translateX(-10px) scale(0.95);
        }
        
        .submenu-enter-active {
          opacity: 1;
          transform: translateX(0) scale(1);
          transition: all 0.2s ease-out;
        }
      `}</style>

      <div className="relative">
        {/* Fixed Sidebar */}
        <div
          ref={sidebarRef}
          className={`
            fixed left-0 top-0 h-screen z-40
            bg-secondary border-r border-primary-custom 
            transition-all duration-300 ease-in-out flex flex-col shadow-primary-custom
            ${isExpanded ? "w-max" : "w-16"}
          `}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-secondary-custom h-16 ">
            <div
              className={`flex items-center gap-2 transition-all duration-300 overflow-hidden ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
            >
              <h2 className="font-semibold text-sm text-primary-custom whitespace-nowrap">
                Components
              </h2>
            </div>
            <button
              onClick={togglePin}
              className={`
                p-2 rounded-lg hover-secondary-custom transition-all duration-200 
                flex items-center justify-center w-10 h-10
              `}
            >
              <Menu className="h-4 w-4 text-secondary-custom" />
            </button>
          </div>

          {/* Categories - Scrollable with custom scrollbar */}
          <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
            {categories.map((category, index) => {
              const IconComponent = category.icon;

              return (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() =>
                    handleCategoryMouseEnter(category.id, index)
                  }
                >
                  <NavLink
                    to={`/category/${category.id}`}
                    className={({ isActive }) =>
                      `
                        flex items-center ${isExpanded ? "gap-2" : "gap-0"} px-3 py-2 mx-2 mb-1 rounded-md transition-all duration-200 group relative hover-secondary-custom
                        ${!isExpanded ? "justify-center" : ""}
                        ${isActive
                        ? "text-primary-custom shadow-primary-custom"
                        : "text-secondary-custom"
                      }
                      `
                    }
                  >
                    <div
                      className={`flex items-center justify-center ${!isExpanded ? "w-6 h-6" : ""
                        }`}
                    >
                      <IconComponent className="h-5 w-5 shrink-0" />
                    </div>

                    <div
                      className={`
                      flex items-center justify-between flex-1 transition-all duration-300 overflow-hidden
                      ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"}
                    `}
                    >
                      <span className="truncate font-medium text-sm">
                        {category.title}
                      </span>
                      {category.items && category.items.length > 0 && (
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-xs bg-secondary-custom text-primary-custom px-2 py-1 rounded-full font-medium">
                            {category.items.length}
                          </span>
                        </div>
                      )}
                    </div>
                  </NavLink>

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && hoveredCategory === category.id && (
                    <div className="absolute left-full top-0 ml-3 z-50 pointer-events-none">
                      <div className="bg-secondary-custom text-primary-custom px-3 py-2 rounded-lg shadow-primary-custom border border-primary-custom text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200">
                        <div className="font-medium">{category.title}</div>
                        {category.items && category.items.length > 0 && (
                          <div className="text-xs opacity-75 mt-1">
                            {category.items.length} components
                          </div>
                        )}
                        {/* Tooltip arrow */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-secondary-custom rotate-45"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Expanded submenu - Smart positioning */}
        {isExpanded && hoveredCategory && (
          <div
            ref={submenuRef}
            className="fixed z-50 left-64"
            style={{
              top:
                submenuPosition.top !== "auto"
                  ? `${submenuPosition.top}px`
                  : "auto",
              bottom:
                submenuPosition.bottom !== "auto"
                  ? `${submenuPosition.bottom}px`
                  : "auto",
              maxHeight:
                submenuPosition.bottom !== "auto"
                  ? `${typeof window !== "undefined"
                    ? window.innerHeight -
                    (submenuPosition.bottom) -
                    20
                    : 400
                  }px`
                  : "calc(100vh - 100px)",
            }}
            onMouseEnter={handleSubmenuMouseEnter}
            onMouseLeave={handleSubmenuMouseLeave}
          >
            {(() => {
              const category = categories.find((c) => c.id === hoveredCategory);
              if (!category || !category.items || category.items.length === 0)
                return null;

              const IconComponent = category.icon;
              return (
                <div className="bg-secondary border border-secondary-custom rounded-xl shadow-primary-custom min-w-[320px] max-w-[420px] py-2 ml-3 backdrop-blur-sm bg-primary-custom/95 animate-in fade-in slide-in-from-left-2 duration-200">
                  <div className="px-4 py-3 text-sm font-semibold text-secondary-custom border-b border-secondary-custom flex items-center gap-3 bg-secondary-custom/50">
                    <div className="flex items-center justify-center w-5 h-5 text-primary-custom rounded-lg">
                      <IconComponent className="h-3 w-3 text-primary-custom" />
                    </div>
                    <span className="flex-1">{category.title}</span>
                    <span className="text-xs text-primary-custom text-primary-custom px-2 py-1 rounded-full font-medium">
                      {category.items.length}
                    </span>
                  </div>
                  <div
                    className="overflow-y-auto custom-scrollbar"
                    style={{ maxHeight: "calc(80vh - 120px)" }}
                  >
                    {category.items.map((item, itemIndex) => {
                      const ItemIcon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 hover-secondary-custom group ${isActive
                              ? "bg-secondary-custom text-primary-custom border-r-2 border-primary-custom"
                              : "text-secondary-custom"
                            }`
                          }
                          style={{
                            animationDelay: `${itemIndex * 20}ms`,
                          }}
                        >
                          <div className="flex items-center justify-center w-5 h-5">
                            <ItemIcon className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                          </div>
                          <span className="truncate font-medium">
                            {item.title}
                          </span>
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-all duration-200 ml-auto" />
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Spacer div to push content */}
        <div
          className={`transition-all duration-300 ease-in-out ${isExpanded ? "w-max" : "w-16"
            }`}
        />
      </div>
    </>
  );
}