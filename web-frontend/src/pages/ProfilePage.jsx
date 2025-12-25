import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera, 
  Bell, Lock, CreditCard, Settings, Upload, FileText, Car, 
  Shield, Globe, CreditCard as Card, History, Star, Trash2,
  Eye, EyeOff, Download, CheckCircle2, AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);
  
  // Load user data from localStorage
  const currentUser = JSON.parse(localStorage.getItem("carrent_current_user") || "{}");
  const users = JSON.parse(localStorage.getItem("carrent_users") || "[]");
  const userData = users.find(u => u.id === currentUser.id) || {};
  
  // Split full name into first and last name
  const nameParts = (userData.name || "").split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  
  const [profileData, setProfileData] = useState({
    firstName: firstName,
    lastName: lastName,
    email: userData.email || "",
    phone: userData.phone || "",
    address: userData.address || "",
    profilePicture: userData.profilePicture || null,
    drivingCard: userData.drivingCard || null,
    nationalCard: userData.nationalCard || null,
  });

  const [documents, setDocuments] = useState([
    { id: 1, name: "Driver's License", type: "license", file: "license.pdf", uploaded: "2024-01-15", status: "approved" },
    { id: 2, name: "ID Card", type: "id", file: "id.pdf", uploaded: "2024-01-10", status: "approved" },
    { id: 3, name: "Proof of Address", type: "address", file: "address.pdf", uploaded: "2024-01-05", status: "pending" },
    { id: 4, name: "International License", type: "international_license", file: "international_license.pdf", uploaded: "2024-01-20", status: "approved" },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "visa", last4: "4242", expiry: "12/26", isDefault: true },
    { id: 2, type: "mastercard", last4: "5555", expiry: "08/25", isDefault: false },
  ]);

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false
  });

  const handleSave = () => {
    // Update user data in localStorage
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          name: `${profileData.firstName} ${profileData.lastName}`.trim(),
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          profilePicture: profileData.profilePicture,
        };
      }
      return u;
    });
    localStorage.setItem("carrent_users", JSON.stringify(updatedUsers));
    
    // Update current user session
    const updatedCurrentUser = {
      ...currentUser,
      name: `${profileData.firstName} ${profileData.lastName}`.trim(),
      email: profileData.email,
    };
    localStorage.setItem("carrent_current_user", JSON.stringify(updatedCurrentUser));
    
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    toast("Changes cancelled");
  };

  const handleChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSecurityChange = (e) => {
    setSecurityData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error("Image must be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAvatarUpload = () => {
    fileInputRef.current.click();
  };

  const handleDocumentUpload = (type) => {
    // Simulate upload
    const newDoc = {
      id: documents.length + 1,
      name: type === "license" ? "New License" : 
            type === "id" ? "New ID Card" : 
            "New document",
      type,
      file: "new_document.pdf",
      uploaded: new Date().toISOString().split('T')[0],
      status: "pending"
    };
    
    setDocuments(prev => [...prev, newDoc]);
    toast.success("Document uploaded successfully!");
  };

  const handleDeleteDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success("Document deleted");
  };

  const handleSetDefaultPayment = (id) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    toast.success("Payment method set as default");
  };

  const handleDeletePayment = (id) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    toast.success("Payment method deleted");
  };

  const handleUpdateSecurity = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (securityData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorEnabled: securityData.twoFactorEnabled
    });
    
    toast.success("Password updated successfully!");
  };

  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "security", label: "Security", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Settings },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getCardIcon = (type) => {
    switch (type) {
      case "visa": return "💳";
      case "mastercard": return "💳";
      case "paypal": return "🏦";
      default: return "💳";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-[#1a0f24] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="mb-8"
        >
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 p-6">
              {/* Avatar Section */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
                    {profileData.profilePicture ? (
                      <img 
                        src={profileData.profilePicture} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>{profileData.firstName[0] || ""}{profileData.lastName[0] || ""}</>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                    capture="environment"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={triggerAvatarUpload}
                    className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                    title="Change photo"
                  >
                    <Camera className="w-4 h-4" />
                  </motion.button>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-gray-500 dark:text-white/70">{profileData.email}</p>
                
                {/* Stats */}
                
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-purple-300">12</div>
                    <div className="text-sm text-gray-500 dark:text-white/70">Bookings</div>
                  </div>
                  
                
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300"
                          : "text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-indigo-900/20"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Personal Information */}
              {activeTab === "personal" && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
                      {!isEditing ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-purple-600 text-white rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-purple-700 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </motion.button>
                      ) : (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-indigo-900/40 text-gray-700 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-indigo-900/60 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </motion.button>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Section 1 */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>First Name</span>
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="firstName"
                              value={profileData.firstName}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-purple-700/30 rounded-lg bg-white dark:bg-indigo-900/40 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-500/20 outline-none transition-colors"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 dark:bg-indigo-900/40 rounded-lg text-gray-900 dark:text-white">{profileData.firstName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Last Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="lastName"
                              value={profileData.lastName}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-purple-700/30 rounded-lg bg-white dark:bg-indigo-900/40 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-500/20 outline-none transition-colors"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 dark:bg-indigo-900/40 rounded-lg text-gray-900 dark:text-white">{profileData.lastName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-purple-700/30 rounded-lg bg-white dark:bg-indigo-900/40 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-500/20 outline-none transition-colors"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 dark:bg-indigo-900/40 rounded-lg text-gray-900 dark:text-white">{profileData.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>Phone</span>
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-purple-700/30 rounded-lg bg-white dark:bg-indigo-900/40 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-500/20 outline-none transition-colors"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 dark:bg-indigo-900/40 rounded-lg text-gray-900 dark:text-white">{profileData.phone}</p>
                          )}
                        </div>
                      </div>

                      {/* Section 2 */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Address</span>
                          </label>
                          {isEditing ? (
                            <textarea
                              name="address"
                              value={profileData.address}
                              onChange={handleChange}
                              rows="3"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-purple-700/30 rounded-lg bg-white dark:bg-indigo-900/40 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-500/20 outline-none transition-colors resize-none"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 dark:bg-indigo-900/40 rounded-lg text-gray-900 dark:text-white">{profileData.address}</p>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Documents */}
              {activeTab === "documents" && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Documents</h3>
                        <p className="text-gray-600 dark:text-white/70">Manage your required documents for rental</p>
                      </div>
                    </div>

                    {/* Required Documents */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Required Documents</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { type: "drivingCard", label: "Driving Card", data: profileData.drivingCard },
                          { type: "nationalCard", label: "National Card", data: profileData.nationalCard },
                        ].map(doc => (
                          <div key={doc.type} className="p-4 border border-gray-200 dark:border-purple-800/30 rounded-xl bg-white/40 dark:bg-indigo-900/20">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-600 dark:text-white" />
                                <span className="font-medium text-gray-900 dark:text-white">{doc.label}</span>
                              </div>
                              <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-full">
                                Required
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {doc.data ? (
                                <a
                                  href={doc.data}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-200 font-medium"
                                >
                                  View Document
                                </a>
                              ) : (
                                <span className="text-sm text-gray-500 dark:text-white/70">Not uploaded</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payments */}
              {activeTab === "payments" && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment Methods</h3>
                        <p className="text-gray-600 dark:text-white/70">Manage your cards and payment methods</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-purple-600 text-white rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-purple-700 transition-colors"
                      >
                        <Card className="w-4 h-4" />
                        <span>Add card</span>
                      </motion.button>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-4">
                      {paymentMethods.map(method => (
                        <div key={method.id} className="p-4 border border-gray-200 dark:border-purple-800/30 rounded-xl bg-white/40 dark:bg-indigo-900/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded flex items-center justify-center text-white">
                                {getCardIcon(method.type)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {method.type === "visa" ? "Visa" : "Mastercard"} •••• {method.last4}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-white/70">Expires {method.expiry}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {method.isDefault ? (
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                                  Default
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleSetDefaultPayment(method.id)}
                                  className="text-sm text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-200 font-medium"
                                >
                                  Set as default
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeletePayment(method.id)}
                                className="p-2 text-gray-400 dark:text-white/50 hover:text-red-600 dark:hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment History */}
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment History</h4>
                      <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-purple-800/30">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">Booking #2024-00{i}</div>
                              <div className="text-sm text-gray-500 dark:text-white/70">Toyota Corolla 2022</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900 dark:text-white">1,600 MAD</div>
                              <div className="text-sm text-gray-500 dark:text-white/70">March 15, 2024</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Security</h3>
                    
                    {/* Change Password */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="currentPassword"
                              value={securityData.currentPassword}
                              onChange={handleSecurityChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-purple-700/30 rounded-lg bg-white dark:bg-indigo-900/40 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-500/20 outline-none transition-colors pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white/50 hover:text-gray-600 dark:hover:text-white"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              value={securityData.newPassword}
                              onChange={handleSecurityChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-purple-700/30 rounded-lg bg-white dark:bg-indigo-900/40 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-500/20 outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={securityData.confirmPassword}
                              onChange={handleSecurityChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-purple-700/30 rounded-lg bg-white dark:bg-indigo-900/40 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-500/20 outline-none transition-colors"
                            />
                          </div>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleUpdateSecurity}
                          className="px-6 py-3 bg-indigo-600 dark:bg-purple-600 text-white rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-purple-700 transition-colors"
                        >
                          Update Password
                        </motion.button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Preferences */}
              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Preferences</h3>
                    
                    <div className="space-y-6">
                      {/* Notifications */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h4>
                        <div className="space-y-3">
                          {[
                            { label: "Email Notifications", description: "Receive emails for your bookings" },
                            { label: "SMS Notifications", description: "Receive SMS for confirmations" },
                            { label: "Newsletter", description: "Receive our exclusive offers" },
                          ].map((pref, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{pref.label}</div>
                                <div className="text-sm text-gray-500 dark:text-white/70">{pref.description}</div>
                              </div>
                              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 dark:bg-purple-600">
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Language & Region */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Language & Region</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Language</label>
                            <select className="w-full px-4 py-3 border border-gray-300 dark:border-purple-700/30 rounded-lg bg-white dark:bg-indigo-900/40 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-500/20 outline-none transition-colors">
                              <option>English</option>
                              <option>French</option>
                              <option>Arabic</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Currency</label>
                            <select className="w-full px-4 py-3 border border-gray-300 dark:border-purple-700/30 rounded-lg bg-white dark:bg-indigo-900/40 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-500/20 outline-none transition-colors">
                              <option>MAD (Moroccan Dirham)</option>
                              <option>EUR (Euro)</option>
                              <option>USD (US Dollar)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}