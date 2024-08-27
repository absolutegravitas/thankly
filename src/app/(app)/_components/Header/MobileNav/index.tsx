'use client'

import React, { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from 'lucide-react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { CMSLink } from '../../CMSLink'
import { FullLogo } from '@/app/(app)/_icons/FullLogo'
import UserButton from '../../Auth/user-button'

export const MobileNav: React.FC<{ tabs: any[] }> = ({ tabs }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<number | null>(null)

  const handleTabClick = (index: number) => {
    setActiveTab(activeTab === index ? null : index)
  }

  const handleLinkClick = () => {
    console.log('Link clicked')
    setSidebarOpen(false)
  }

  return (
    <>
      <div className="lg:hidden">
        <Gutter>
          <div className="fixed top-0 z-40 flex w-full justify-between gap-x-8 bg-white  py-4 pr-8 shadow-sm  transition-colors duration-300 max-w-full before:absolute before:top-0 before:left-0 before:w-full before:h-full #before:bg-white before:backdrop-blur-md before:opacity-100 before:z-[-1] before:transition-opacity before:duration-500 before:ease-out after:block after:absolute after:top-0 after:left-0 after:w-full after:h-full after:z-[-1] after:opacity-100 after:transition-opacity after:duration-500 after:ease-out">
            <Link href="/" className={`no-underline`} prefetch={false}>
              <FullLogo />
            </Link>
            <div className="flex flex-row gap-3">
              <CartNotification />

              <div>
                <MenuIcon onClick={() => setSidebarOpen(true)} />
              </div>
            </div>
          </div>
        </Gutter>

        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 " onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-16 flex w-full #max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-0 top-0 flex w-16 justify-center">
                      <button
                        type="button"
                        className="m-2.5 p-2.5 bg-white border-0"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon className="h-6 w-6 " aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>

                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                    <div className="flex h-16 shrink-0 items-center">
                      <FullLogo />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <span className="flex flex-row gap-3 justify-between">
                        <div className="cursor-pointer flex flex-row gap-3 pb-6 ">
                          <CartNotification />
                          {`View Cart`}
                        </div>
                        <div className="cursor-pointer flex flex-row gap-3 pb-6 ">
                          <UserButton />
                        </div>
                      </span>
                      <div role="list" className="flex flex-1 flex-col gap-y-3">
                        {tabs.map((tab, index) => (
                          <div key={tab.id}>
                            {tab.enableDirectLink ? (
                              <CMSLink
                                className="no-underline block py-2 text-base font-semibold leading-6 text-gray-900"
                                data={{
                                  label: tab.label,
                                  ...tab.link,
                                }}
                                look={{ variant: 'links' }}
                                actions={{ onClick: handleLinkClick }}
                              >
                                {tab.label}
                              </CMSLink>
                            ) : tab.enableDropdown ? (
                              <>
                                <button
                                  className="flex w-full items-center justify-between py-2 text-base font-semibold leading-6 text-gray-900 border-0 bg-white"
                                  onClick={() => handleTabClick(index)}
                                >
                                  {tab.label}
                                  {activeTab === index ? (
                                    <ChevronUp className="h-5 w-5" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5" />
                                  )}
                                </button>
                                {activeTab === index && (
                                  <div className="mt-2 space-y-2 pl-4">
                                    {tab.description && (
                                      <p className="text-sm text-gray-500">{tab.description}</p>
                                    )}
                                    {tab.descriptionLinks?.map((link: any) => (
                                      <CMSLink
                                        key={link.id}
                                        className="block py-1 text-sm leading-6 text-gray-600 hover:text-gray-900"
                                        data={link.link}
                                        look={{ variant: 'links' }}
                                        actions={{ onClick: handleLinkClick }}
                                      />
                                    ))}
                                    {tab.items?.map((item: any) => (
                                      <div key={item.id} className="mt-2">
                                        {item.style === 'default' && item.defaultLink && (
                                          <CMSLink
                                            className="block py-1 text-sm font-medium leading-6 text-gray-900"
                                            data={item.defaultLink.link}
                                            look={{ variant: 'links' }}
                                            actions={{ onClick: handleLinkClick }}
                                          >
                                            {item.defaultLink.link.label}
                                          </CMSLink>
                                        )}
                                        {item.style === 'featured' && item.featuredLink && (
                                          <div>
                                            {item.featuredLink.tag && (
                                              <div className="mb-1 text-xs font-semibold text-gray-500">
                                                {item.featuredLink.tag}
                                              </div>
                                            )}
                                            {item.featuredLink.links?.map(
                                              (link: any, linkIndex: number) => (
                                                <CMSLink
                                                  key={linkIndex}
                                                  className="block py-1 text-sm leading-6 text-gray-600 hover:text-gray-900"
                                                  data={link.link}
                                                  look={{ variant: 'links' }}
                                                  actions={{ onClick: handleLinkClick }}
                                                />
                                              ),
                                            )}
                                          </div>
                                        )}
                                        {item.style === 'list' && item.listLinks && (
                                          <div>
                                            {item.listLinks.tag && (
                                              <div className="mb-1 text-xs font-semibold text-gray-500">
                                                {item.listLinks.tag}
                                              </div>
                                            )}
                                            {item.listLinks.links?.map(
                                              (link: any, linkIndex: number) => (
                                                <CMSLink
                                                  key={linkIndex}
                                                  className="block py-1 text-sm leading-6 text-gray-600 hover:text-gray-900"
                                                  data={link.link}
                                                  look={{ variant: 'links' }}
                                                  actions={{ onClick: handleLinkClick }}
                                                />
                                              ),
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="block py-2 text-base font-semibold leading-6 text-gray-900">
                                {tab.label}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  )
}
// import * as React from 'react'
// import { Modal, useModal } from '@faceless-ui/modal'
import Link from 'next/link'
// import { usePathname } from 'next/navigation'

// import { Avatar } from '@app/_components/Avatar'
import { Gutter } from '@app/_components/Gutter'
// import { RichText } from '@app/_blocks/RichText'
// import { ArrowIcon } from '@app/_icons/ArrowIcon'
// import { Menu } from '@payload-types'
// import { useHeaderObserver } from '@app/_providers/HeaderIntersectionObserver'
// import { Theme } from '@app/_providers/Theme/types'
// import { FullLogo } from '@/app/(app)/_icons/FullLogo'
// import { MenuIcon } from '@/app/(app)/_icons/MenuIcon'
// import { CMSLink } from '../../CMSLink'
import { CartNotification } from '@app/_components/CartNotification'
// import { PlusIcon } from 'lucide-react'
// import UserButton from '../../Auth/user-button'

// import classes from './index.module.scss'

// export const modalSlug = 'mobile-nav'
// export const subMenuSlug = 'mobile-sub-menu'

// type NavItems = Pick<Menu, 'tabs'>

// const MobileNavItems = ({ tabs, setActiveTab }: any) => {
//   const { openModal } = useModal()

//   const handleOnClick = (index: any) => {
//     openModal(subMenuSlug)
//     setActiveTab(index)
//   }

//   return (
//     <ul className={classes.mobileMenuItems}>
//       {(tabs || []).map((tab: any, index: any) => {
//         const { link, label, enableDirectLink, enableDropdown } = tab

//         if (!enableDropdown)
//           return <CMSLink {...link} className={classes.mobileMenuItem} key={index} label={label} />

//         if (enableDirectLink)
//           return (
//             <button
//               onClick={() => handleOnClick(index)}
//               className={classes.mobileMenuItem}
//               key={index}
//             >
//               <CMSLink
//                 className={classes.directLink}
//                 {...link}
//                 label={label}
//                 onClick={(e: any) => {
//                   e.stopPropagation()
//                 }}
//               />
//               <ArrowIcon size="medium" rotation={45} />
//             </button>
//           )
//         else
//           return (
//             <CMSLink
//               {...link}
//               className={classes.mobileMenuItem}
//               key={index}
//               label={label}
//               onClick={() => handleOnClick(index)}
//             >
//               <ArrowIcon size="medium" rotation={45} />
//             </CMSLink>
//           )
//       })}
//       <UserButton />
//     </ul>
//   )
// }

// const MobileMenuModal: React.FC<
//   NavItems & {
//     setActiveTab: (index: number) => void
//     theme?: Theme | null
//   }
// > = ({ tabs, setActiveTab, theme }) => {
//   return (
//     <Modal slug={modalSlug} className={classes.mobileMenuModal} trapFocus={false}>
//       <Gutter className={classes.mobileMenuWrap} rightGutter={false} dataTheme={`${theme}`}>
//         <MobileNavItems tabs={tabs} setActiveTab={setActiveTab} />

//         <div className={classes.modalBlur} />
//       </Gutter>
//     </Modal>
//   )
// }

// const SubMenuModal: React.FC<
//   NavItems & {
//     activeTab: number | undefined
//     theme?: Theme | null
//   }
// > = ({ tabs, activeTab, theme }) => {
//   const { closeModal, closeAllModals } = useModal()

//   return (
//     <Modal
//       slug={subMenuSlug}
//       className={[classes.mobileMenuModal, classes.mobileSubMenu].join(' ')}
//       trapFocus={false}
//       onClick={closeAllModals}
//     >
//       <Gutter className={classes.subMenuWrap} dataTheme={`${theme}`}>
//         {(tabs || []).map((tab, tabIndex) => {
//           if (tabIndex !== activeTab) return null
//           return (
//             <div className={classes.subMenuItems} key={tabIndex}>
//               <button
//                 className={classes.backButton}
//                 onClick={(e) => {
//                   closeModal(subMenuSlug)
//                   e.stopPropagation()
//                 }}
//               >
//                 <ArrowIcon size="medium" rotation={225} />
//                 Back
//               </button>
//               {tab.descriptionLinks && tab.descriptionLinks.length > 0 && (
//                 <div className={classes.descriptionLinks}>
//                   {tab.descriptionLinks.map((link, linkIndex) => (
//                     <CMSLink className={classes.descriptionLink} key={linkIndex} {...link.link}>
//                       <ArrowIcon className={classes.linkArrow} />
//                     </CMSLink>
//                   ))}
//                 </div>
//               )}
//               {(tab.items || []).map((item: any, index: any) => {
//                 return (
//                   <div className={classes.linkWrap} key={index}>
//                     {item.style === 'default' && item.defaultLink && (
//                       <CMSLink className={classes.defaultLink} {...item.defaultLink.link} label="">
//                         <div className={classes.listLabelWrap}>
//                           <div className={classes.listLabel}>
//                             {item.defaultLink.link.label}
//                             <ArrowIcon size="medium" rotation={0} />
//                           </div>
//                           <div className={classes.itemDescription}>
//                             {item.defaultLink.description}
//                           </div>
//                         </div>
//                       </CMSLink>
//                     )}
//                     {item.style === 'list' && item.listLinks && (
//                       <div className={classes.linkList}>
//                         <div className={classes.tag}>{item.listLinks.tag}</div>
//                         <div className={classes.listWrap}>
//                           {item.listLinks.links &&
//                             item.listLinks.links.map((link: any, linkIndex: any) => (
//                               <CMSLink className={classes.link} key={linkIndex} {...link.link}>
//                                 {link.link?.newTab && link.link?.type === 'custom' && (
//                                   <ArrowIcon className={classes.linkArrow} />
//                                 )}
//                               </CMSLink>
//                             ))}
//                         </div>
//                       </div>
//                     )}
//                     {item.style === 'featured' && item.featuredLink && (
//                       <div className={classes.featuredLink}>
//                         <div className={classes.tag}>{item.featuredLink.tag}</div>
//                         {item.featuredLink?.label && (
//                           <RichText
//                             className={classes.featuredLinkLabel}
//                             content={item.featuredLink.label}
//                           />
//                         )}
//                         <div className={classes.featuredLinkWrap}>
//                           {item.featuredLink.links &&
//                             item.featuredLink.links.map((link: any, linkIndex: any) => (
//                               <CMSLink
//                                 className={classes.featuredLinks}
//                                 key={linkIndex}
//                                 {...link.link}
//                               >
//                                 <ArrowIcon />
//                               </CMSLink>
//                             ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )
//               })}
//             </div>
//           )
//         })}

//         <div className={classes.modalBlur} />
//       </Gutter>
//     </Modal>
//   )
// }

// export const MobileNav: React.FC<NavItems> = (props) => {
//   const { isModalOpen, openModal, closeAllModals } = useModal()
//   const { headerTheme } = useHeaderObserver()
//   const pathname = usePathname()
//   const [activeTab, setActiveTab] = React.useState<number | undefined>()

//   const isMenuOpen = isModalOpen(modalSlug)

//   React.useEffect(() => {
//     closeAllModals()
//   }, [pathname, closeAllModals])

//   const toggleModal = React.useCallback(() => {
//     if (isMenuOpen) {
//       closeAllModals()
//     } else {
//       openModal(modalSlug)
//     }
//   }, [isMenuOpen, closeAllModals, openModal])

//   return (
//     <div className={classes.mobileNav}>
//       <div className={classes.menuBar}>
//         <Gutter>
//           <div className={'grid'}>
//             <div
//               className={[classes.menuBarContainer, 'cols-16 cols-m-8'].filter(Boolean).join(' ')}
//             >
//               <Link href="/" className={`no-underline`} prefetch={false}>
//                 <FullLogo />
//               </Link>
//               <div className={classes.icons}>
//                 <CartNotification />

//                 <div
//                   className={[classes.modalToggler, isMenuOpen ? classes.hamburgerOpen : '']
//                     .filter(Boolean)
//                     .join(' ')}
//                   onClick={toggleModal}
//                   aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
//                 >
//                   <MenuIcon />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Gutter>
//       </div>
//       <MobileMenuModal {...props} setActiveTab={setActiveTab} theme={headerTheme} />
//       <SubMenuModal {...props} activeTab={activeTab} theme={headerTheme} />
//     </div>
//   )
// }
