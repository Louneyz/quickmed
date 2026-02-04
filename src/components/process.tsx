import { User, Upload, Truck, CheckCircle } from "lucide-react";

const steps = [
    {
        number: "1",
        title: "Create Your Profile",
        description: "Sign up in seconds and verify your pharmacy credentials.",
        icon: User,
    },
    {
        number: "2",
        title: "Upload Delivery Info",
        description: "Upload your patients' delivery details via our secure portal.",
        icon: Upload,
    },
    {
        number: "3",
        title: "Driver Pickup",
        description: "A specially trained driver arrives to pick up your orders.",
        icon: Truck,
    },
    {
        number: "4",
        title: "Delivery Complete",
        description: "Your patient receives their delivery the very same day.",
        icon: CheckCircle,
    },
];

export function Process() {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6">How It Works</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Our streamlined process ensures that medications reach patients quickly, safely, and securely.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Vertical Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-100 via-blue-200 to-blue-100 transform -translate-x-1/2 rounded-full"></div>

                    <div className="space-y-12 md:space-y-24">
                        {steps.map((step, index) => (
                            <div key={index} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Content Side */}
                                <div className="flex-1 w-full md:w-1/2 p-6">
                                    <div className={`flex flex-col ${index % 2 === 0 ? 'md:items-start md:text-left' : 'md:items-end md:text-right'} items-center text-center`}>
                                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 text-primary">
                                            <step.icon size={32} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">{step.title}</h3>
                                        <p className="text-slate-500 leading-relaxed max-w-sm">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Center Number Bubble */}
                                <div className="relative z-10 flex-shrink-0 w-20 h-20 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center shadow-lg my-6 md:my-0">
                                    <span className="text-3xl font-black text-primary">{step.number}</span>
                                </div>

                                {/* Empty Side for Balance */}
                                <div className="flex-1 w-full md:w-1/2 p-6 hidden md:block"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
