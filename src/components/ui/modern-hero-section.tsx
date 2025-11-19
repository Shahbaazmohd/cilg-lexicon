import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import { SettingsService } from '@/lib/settingsService'
import type { Variants, Transition } from 'framer-motion'

const spring1500: Transition = { type: 'spring', bounce: 0.3, duration: 1.5 }
const spring2000: Transition = { type: 'spring', bounce: 0.3, duration: 2 }

const transitionVariants: { item: Variants } = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: spring1500,
        },
    },
}

interface ModernHeroSectionProps {
    heroImageUrl: string;
}

export function ModernHeroSection({ heroImageUrl }: ModernHeroSectionProps) {
    const [logoUrl, setLogoUrl] = useState<string>(
        '/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png'
    )

    useEffect(() => {
        let isMounted = true
        SettingsService.getLogoUrl().then((url) => {
            if (isMounted && url) setLogoUrl(url)
        })
        return () => {
            isMounted = false
        }
    }, [])

    return (
        <main className="overflow-hidden">
            <div
                aria-hidden
                className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
            </div>
            <section>
                <div className="relative pt-1 md:pt-2">
                    <AnimatedGroup
                        variants={{
                            container: {
                                visible: {
                                    transition: {
                                        delayChildren: 1,
                                    },
                                },
                            },
                            item: {
                                hidden: {
                                    opacity: 0,
                                    y: 20,
                                },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: spring2000,
                                },
                            },
                        }}
                        className="absolute inset-0 -z-20">
                        <img
                            src={heroImageUrl}
                            alt="Academic background"
                            className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 w-full h-full object-cover"
                            width="3276"
                            height="4095"
                        />
                    </AnimatedGroup>
                    <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                            <AnimatedGroup variants={transitionVariants}>
                                {/* Pill button moved below heading */}

                                {/* Centered logo */}
                                <div className="mt-1 lg:mt-4 flex justify-center">
                                    <img
                                        src={logoUrl}
                                        alt="CILG Logo"
                                        className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-40 lg:w-40 xl:h-48 xl:w-48 object-contain"
                                    />
                                </div>

                                <h1
                                    className="mt-2 max-w-4xl mx-auto text-balance text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-[5.25rem] academic-heading px-4">
                                    Cell for International<br />
                                    <span className="text-primary">Law & Governance</span>
                                </h1>
                                
                                <p
                                    className="mx-auto mt-6 max-w-2xl text-balance text-base sm:text-lg md:text-xl lg:text-2xl font-medium academic-text px-4">
                                    University School of Law and Legal Studies
                                    <br />
                                    Guru Gobind Singh Indraprastha University
                                </p>
                                <div className="mt-4 flex flex-col items-center gap-3 px-4">
                                    <a
                                        href="http://www.ipu.ac.in/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group flex w-fit items-center gap-2 sm:gap-3 rounded-full border p-0.5 pl-3 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-xs sm:text-sm">About Guru Gobind Singh Indraprastha University</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                    <a
                                        href="/about"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group flex w-fit items-center gap-2 sm:gap-3 rounded-full border p-0.5 pl-3 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-xs sm:text-sm">About University School of Law & Legal Studies</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </AnimatedGroup>

                            <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.75,
                                            },
                                        },
                                    },
                                    ...transitionVariants,
                                }}
                                className="mt-8 sm:mt-12 flex flex-col items-center justify-center gap-3 sm:gap-2 md:flex-row px-4">
                                <div
                                    key={1}
                                    className="bg-foreground/10 rounded-[14px] border p-0.5 w-full sm:w-auto">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="rounded-xl px-4 sm:px-5 text-sm sm:text-base bg-academic hover:bg-academic/90 text-academic-foreground w-full sm:w-auto">
                                        <Link to="/blog">
                                            <span className="text-nowrap">CILG Blog</span>
                                        </Link>
                                    </Button>
                                </div>
                                <div
                                    key={2}
                                    className="bg-foreground/10 rounded-[14px] border p-0.5 w-full sm:w-auto">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="rounded-xl px-4 sm:px-5 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                                        <Link to="/submit-blog">
                                            <span className="text-nowrap">Submit Manuscript</span>
                                        </Link>
                                    </Button>
                                </div>
                            </AnimatedGroup>
                        </div>
                    </div>

                    <AnimatedGroup
                        variants={{
                            container: {
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05,
                                        delayChildren: 0.75,
                                    },
                                },
                            },
                            ...transitionVariants,
                        }}>
                        <div className="relative mt-8 overflow-hidden px-4 sm:px-2 sm:mt-12 md:mt-20">
                            <div
                                aria-hidden
                                className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                            />
                            <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-2 sm:p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                <img
                                    className="bg-background aspect-15/8 relative rounded-2xl w-full object-cover object-center"
                                    src={heroImageUrl}
                                    alt="Academic excellence"
                                    width="2700"
                                    height="1440"
                                />
                            </div>
                        </div>
                    </AnimatedGroup>
                </div>
            </section>
            {/* Add extra padding after hero section */}
            <div className="pb-8 md:pb-12 lg:pb-16"></div>
        </main>
    )
} 