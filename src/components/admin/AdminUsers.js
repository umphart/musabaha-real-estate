import React, { useState, useEffect } from 'react';  
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { 
  FiSearch, FiPlus, FiFileText, FiDownload, FiX, FiEye, 
  FiEdit, FiTrash2, FiDollarSign, FiCalendar, FiUser, 
  FiHome, FiCreditCard, FiPieChart, FiCheckCircle, FiClock,
  FiPhone, FiMapPin, FiList, FiCircle, FiInfo, FiUserPlus, FiTag, 
  FiTrendingDown, FiUpload, FiDatabase
} from 'react-icons/fi';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ visible: false, userId: null });
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  
  const [newUser, setNewUser] = useState({
    name: '',
    contact: '',
    plot_taken: '',
    date_taken: '',
    initial_deposit: '',
    price_per_plot: '',
    payment_schedule: 'Monthly',
    total_balance: '',
    number_of_plots: 1
  });

  const [selectedPlots, setSelectedPlots] = useState([]);
  const [plots, setPlots] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [paymentData, setPaymentData] = useState({ 
    amount: '', 
    date: new Date().toISOString().slice(0, 16), 
    note: '',
    admin: ''
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://musabaha-homes.onrender.com/api';

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  // Show SweetAlert2 notifications
  const showAlert = (type, message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: type,
      title: message
    });
  };

  // Show confirmation dialog
  const showConfirmDialog = (title, text, confirmButtonText = 'Yes') => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({ ...prev, [name]: value }));
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      console.log('Fetched users:', data);
      if (data.success) {
        setUsers(data.data);
      } else {
        showAlert('error', data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showAlert('error', 'Failed to fetch users. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const res = await fetch("https://musabaha-homes.onrender.com/api/plots");
        const data = await res.json();
        console.log("Fetched plots:", data);
        
        if (data.success) {
          setPlots(data.data.filter(plot => plot.status === "Available"));
        }
      } catch (err) {
        console.error("Error fetching plots:", err);
      }
    };

    fetchPlots();
  }, []);

  const handlePlotSelection = (plot) => {
    setSelectedPlots(prevSelected => {
      const isAlreadySelected = prevSelected.some(p => p.id === plot.id);
      
      if (isAlreadySelected) {
        return prevSelected.filter(p => p.id !== plot.id);
      } else {
        return [...prevSelected, plot];
      }
    });
  };

  // Update newUser when selectedPlots changes
  useEffect(() => {
    if (selectedPlots.length > 0) {
      const plotNumbers = selectedPlots.map(plot => plot.number).join(', ');
      const plotPrices = selectedPlots.map(plot => plot.price).join(', ');
      const totalPrice = selectedPlots.reduce((sum, plot) => sum + parseFloat(plot.price || 0), 0);
      
      setNewUser(prev => ({
        ...prev,
        plot_taken: plotNumbers,
        price_per_plot: plotPrices,
        total_balance: (totalPrice - parseFloat(prev.initial_deposit || 0)).toString(),
        number_of_plots: selectedPlots.length
      }));
    } else {
      setNewUser(prev => ({
        ...prev,
        plot_taken: '',
        price_per_plot: '',
        total_balance: '',
        number_of_plots: 0
      }));
    }
  }, [selectedPlots]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchPlots = async () => {
    try {
      const res = await fetch("http://https://musabaha-homes.onrender.comt:5000/api/plots");
      const data = await res.json();
      console.log("Fetched plots:", data);
      
      if (data.success) {
        setPlots(data.data.filter(plot => plot.status === "Available"));
      }
    } catch (err) {
      console.error("Error fetching plots:", err);
    }
  };

  const calculateTotalPrice = (pricePerPlotStr) => {
    if (!pricePerPlotStr) return 0;
    return pricePerPlotStr
      .split(",")
      .map(p => parseFloat(p.trim()) || 0)
      .reduce((a, b) => a + b, 0);
  };

  // Calculate totals
  const totalBalance = users.reduce((total, user) => {
    return total + parseFloat(user.total_balance || 0);
  }, 0);

  const totalPlotValue = users.reduce((total, user) => {
    return total + calculateTotalPrice(user.price_per_plot);
  }, 0);

  const totalDeposits = users.reduce((total, user) => {
    return total + parseFloat(user.initial_deposit || 0);
  }, 0);

  const totalPlotsSold = users.reduce((total, user) => {
    return total + parseInt(user.number_of_plots || 1);
  }, 0);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.plot_taken.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const token = getAuthToken();
      const totalPlotPrice = calculateTotalPrice(newUser.price_per_plot);
      const totalBalance = totalPlotPrice - parseFloat(newUser.initial_deposit || 0);

      if (!newUser.name || !newUser.contact || selectedPlots.length === 0) {
        showAlert('error', 'Please fill in all required fields and select at least one plot.');
        return;
      } 
      const priceList = selectedPlots.map(plot => plot.price).join(', ');
    
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newUser,
          price_per_plot: priceList,
          total_balance: totalBalance.toString(),
          number_of_plots: selectedPlots.length
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowCreateModal(false);
        setSelectedPlots([]);
        setNewUser({
          name: '',
          contact: '',
          plot_taken: '',
          date_taken: '',
          initial_deposit: '',
          price_per_plot: '',
          payment_schedule: '',
          total_balance: '',
          number_of_plots: '',
        });
        showAlert('success', 'User created successfully and plots updated to Sold status.');
        fetchUsers();
        fetchPlots();
      } else {
        showAlert('error', data.message || 'Failed to create user.');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showAlert('error', 'Failed to create user. Please try again.');
    }
  };

  // Add payment via API
  const handleAddPayment = async (userId) => {
    if (!paymentData.amount) {
      showAlert('error', 'Please enter a payment amount.');
      return;
    }

    try {
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/admin/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          amount: parseFloat(paymentData.amount),
          date: paymentData.date,
          note: paymentData.note,
          admin: paymentData.admin
        })
      });

      const data = await response.json();
      console.log('Add payment response:', data);
      
      if (data.success) {
        setPaymentData({
          amount: '',
          date: new Date().toISOString().slice(0, 16),
          note: '',
          admin: paymentData.admin
        });
        showAlert('success', 'Payment added successfully.');
        fetchUsers();
      } else {
        showAlert('error', data.message || 'Failed to add payment.');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      showAlert('error', 'Failed to add payment. Please try again.');
    }
  };

  // Fetch payments for a specific user
  const fetchUserPayments = async (userId) => {
    try {
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/admin/payments/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched payments for user:', data);
        if (data.success) {
          return data.data;
        }
      }
      return [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  };

  const handleViewUser = async (user) => {
    try {
      const payments = await fetchUserPayments(user.id);
      setSelectedUser({ ...user, payments });
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching user payments:', error);
      showAlert('error', 'Failed to load user details.');
    }
  };

  const handleEditUser = (user) => {
    setEditUser({ ...user });
    setShowEditModal(true);
  };

  // Handle delete user
  const handleDeleteUser = (userId) => {
    setConfirmDelete({ visible: true, userId });
  };

  const confirmDeleteUser = async () => {
    const userId = confirmDelete.userId;
    setConfirmDelete({ visible: false, userId: null });

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        showAlert("success", "User deleted successfully.");
        fetchUsers();
      } else {
        showAlert("error", data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showAlert("error", "Failed to delete user. Please try again.");
    }
  };

  // CSV Import functionality
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
    }
  };

const handleImportCSV = async () => {
  if (!csvFile) {
    showAlert('error', 'Please select a CSV file to import.');
    return;
  }

  setImportLoading(true);
  
  try {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { 
          type: 'array',
          cellDates: true,
          cellText: false
        });
        
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false,
          defval: ''
        });

        console.log('Raw CSV Data:', jsonData);

        if (jsonData.length === 0) {
          showAlert('error', 'CSV file is empty.');
          setImportLoading(false);
          return;
        }

        const token = getAuthToken();
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        // Process each row
        for (const [index, row] of jsonData.entries()) {
          try {
            console.log(`Processing row ${index + 1}:`, row);

            // Skip rows with missing essential data
            if (!row.name || !row.name.toString().trim()) {
              errors.push(`Row ${index + 2}: Missing name`);
              errorCount++;
              continue;
            }

            if (!row.plot_taken || !row.plot_taken.toString().trim()) {
              errors.push(`Row ${index + 2}: Missing plot_taken`);
              errorCount++;
              continue;
            }

            // Format contact - ensure it's a string with leading zeros
            let contact = '';
            if (row.contact) {
              contact = row.contact.toString().trim();
              // Add leading zero if it was stripped by Excel
              if (contact.length === 10 && !contact.startsWith('0')) {
                contact = '0' + contact;
              }
              // Remove any non-digit characters
              contact = contact.replace(/\D/g, '');
            }

            // Handle plot_taken - ensure it's treated as string
            let plotTaken = row.plot_taken ? row.plot_taken.toString().trim() : '';
            
            // Fix common concatenated plot numbers
            if (plotTaken === '41') plotTaken = '4,1';
            if (plotTaken === '200820102012') plotTaken = '2008,2010,2012';
            if (plotTaken === '1744/1745') plotTaken = '1744,1745';
            if (plotTaken === '1743/1742') plotTaken = '1743,1742';
            if (plotTaken === '3945/3947/3946/3948') plotTaken = '3945,3947,3946,3948';
            if (plotTaken === '2014/2015') plotTaken = '2014,2015';
            if (plotTaken === '2016/2017') plotTaken = '2016,2017';

            // FIXED DATE HANDLING - Properly handle DD/MM/YYYY format
            let formattedDate = '';
            if (row.date_taken) {
              const dateValue = row.date_taken;
              
              if (typeof dateValue === 'number') {
                // Excel serial number (for dates like 45676.04207175926)
                const excelEpoch = new Date(1899, 11, 30);
                const date = new Date(excelEpoch.getTime() + dateValue * 86400000);
                formattedDate = date.toISOString().split('T')[0];
                console.log(`Excel date conversion: ${dateValue} -> ${formattedDate}`);
              } else {
                // String date - handle DD/MM/YYYY format
                const dateStr = dateValue.toString().trim();
                console.log(`Processing date string: "${dateStr}"`);
                
                if (dateStr.includes('/')) {
                  // Handle DD/MM/YYYY format (like "19/01/2025")
                  const parts = dateStr.split('/');
                  if (parts.length === 3) {
                    const day = parts[0].padStart(2, '0');
                    const month = parts[1].padStart(2, '0');
                    let year = parts[2];
                    
                    // Handle 2-digit years
                    if (year.length === 2) {
                      year = `20${year}`;
                    }
                    
                    // Validate date components
                    const monthNum = parseInt(month);
                    const dayNum = parseInt(day);
                    
                    if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
                      formattedDate = `${year}-${month}-${day}`;
                      console.log(`Date converted: ${dateStr} -> ${formattedDate}`);
                    } else {
                      console.warn(`Invalid date components: ${dateStr}`);
                      formattedDate = new Date().toISOString().split('T')[0];
                    }
                  } else {
                    console.warn(`Unexpected date format: ${dateStr}`);
                    formattedDate = new Date().toISOString().split('T')[0];
                  }
                } else if (dateStr.includes('-')) {
                  // Already in YYYY-MM-DD format, validate it
                  const parts = dateStr.split('-');
                  if (parts.length === 3) {
                    const year = parts[0];
                    const month = parts[1];
                    const day = parts[2];
                    
                    const monthNum = parseInt(month);
                    const dayNum = parseInt(day);
                    
                    if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
                      formattedDate = dateStr; // Use as-is if valid
                    } else {
                      console.warn(`Invalid YYYY-MM-DD date: ${dateStr}`);
                      formattedDate = new Date().toISOString().split('T')[0];
                    }
                  }
                } else {
                  // Try to parse as Excel serial number if it's a number string
                  const serialNumber = parseFloat(dateStr);
                  if (!isNaN(serialNumber)) {
                    const excelEpoch = new Date(1899, 11, 30);
                    const date = new Date(excelEpoch.getTime() + serialNumber * 86400000);
                    formattedDate = date.toISOString().split('T')[0];
                    console.log(`Excel string date conversion: ${dateStr} -> ${formattedDate}`);
                  } else {
                    console.warn(`Unrecognized date format: ${dateStr}`);
                    formattedDate = new Date().toISOString().split('T')[0];
                  }
                }
              }
            } else {
              // No date provided, use current date
              formattedDate = new Date().toISOString().split('T')[0];
              console.log(`No date provided, using current date: ${formattedDate}`);
            }

            // Calculate plot_number from plot_taken
            const plotNumber = plotTaken.split(',').length;

            // Handle price_per_plot - if single plot, use single price; if multiple, create comma-separated
            let pricePerPlot = '3700000'; // Default price
            if (row.price_per_plot) {
              pricePerPlot = row.price_per_plot.toString().trim();
            }
            
            // If multiple plots but only one price provided, duplicate the price
            if (plotNumber > 1 && !pricePerPlot.includes(',')) {
              pricePerPlot = Array(plotNumber).fill(pricePerPlot).join(', ');
            }

            // Standardize payment schedule
            let paymentSchedule = 'Monthly';
            if (row.payment_schedule) {
              const schedule = row.payment_schedule.toString().trim();
              if (schedule.includes('Daily') || schedule === 'Every Day (Daily)') {
                paymentSchedule = 'Daily';
              } else if (schedule.includes('Quarterly')) {
                paymentSchedule = 'Quarterly';
              } else if (schedule.includes('3 Months')) {
                paymentSchedule = '3 Months';
              } else if (schedule.includes('12 Months')) {
                paymentSchedule = '12 Months';
              } else if (schedule.includes('18 Months')) {
                paymentSchedule = '18 Months';
              } else if (schedule.includes('24 Months')) {
                paymentSchedule = '24 Months';
              } else if (schedule.includes('30 Months')) {
                paymentSchedule = '30 Months';
              } else {
                paymentSchedule = 'Monthly';
              }
            }

            // Calculate total_money_to_pay if not provided
            let totalMoneyToPay = row.total_money_to_pay ? parseFloat(row.total_money_to_pay) : 0;
            if (!totalMoneyToPay && pricePerPlot) {
              const prices = pricePerPlot.split(',').map(p => parseFloat(p.trim()) || 0);
              totalMoneyToPay = prices.reduce((sum, price) => sum + price, 0);
            }

            // Calculate total_balance if not provided
            let totalBalance = row.total_balance ? parseFloat(row.total_balance) : 0;
            if (!totalBalance && totalMoneyToPay) {
              const initialDeposit = parseFloat(row.initial_deposit) || 0;
              totalBalance = Math.max(0, totalMoneyToPay - initialDeposit);
            }

            const userData = {
              name: row.name.toString().trim(),
              contact: contact,
              plot_taken: plotTaken,
              date_taken: formattedDate,
              initial_deposit: (row.initial_deposit ? parseFloat(row.initial_deposit) : 0).toString(),
              price_per_plot: pricePerPlot,
              payment_schedule: paymentSchedule,
              total_balance: totalBalance.toString(),
              total_money_to_pay: totalMoneyToPay.toString(),
              status: (row.status ? row.status.toString().toLowerCase() : 'active'),
              plot_number: plotNumber
            };

            console.log('Final user data to send:', userData);

            // Validate critical fields before sending
            if (!userData.name) {
              errors.push(`Row ${index + 2}: Name is required`);
              errorCount++;
              continue;
            }

            if (!userData.plot_taken) {
              errors.push(`Row ${index + 2}: Plot taken is required`);
              errorCount++;
              continue;
            }

            if (!userData.date_taken) {
              errors.push(`Row ${index + 2}: Date taken is required`);
              errorCount++;
              continue;
            }

            const response = await fetch(`${API_BASE_URL}/admin/users`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(userData)
            });

            const result = await response.json();
            
            if (result.success) {
              successCount++;
              console.log(`✓ Successfully imported: ${userData.name}`);
            } else {
              errorCount++;
              const errorMsg = `Row ${index + 2}: ${result.message || 'Failed to create user'}`;
              errors.push(errorMsg);
              console.error(`✗ Failed to import: ${userData.name} - ${errorMsg}`);
            }
          } catch (error) {
            errorCount++;
            const errorMsg = `Row ${index + 2}: ${error.message}`;
            errors.push(errorMsg);
            console.error(`✗ Error processing row ${index + 2}:`, error);
          }
        }

        setShowImportModal(false);
        setCsvFile(null);
        
        // Show results
        if (successCount > 0) {
          if (errorCount > 0) {
            showAlert('warning', `Imported ${successCount} users successfully. ${errorCount} failed. Check console for details.`);
          } else {
            showAlert('success', `Successfully imported ${successCount} users!`);
          }
          fetchUsers();
        } else {
          showAlert('error', `No users were imported. ${errors.length > 0 ? errors[0] : 'Please check your CSV format.'}`);
        }

        // Log all errors for debugging
        if (errors.length > 0) {
          console.error('Import errors:', errors);
        }

      } catch (error) {
        console.error('Error processing CSV:', error);
        showAlert('error', `Error processing CSV file: ${error.message}`);
      } finally {
        setImportLoading(false);
      }
    };
    
    reader.onerror = (error) => {
      console.error('File reading error:', error);
      showAlert('error', 'Error reading file. Please try again.');
      setImportLoading(false);
    };
    
    reader.readAsArrayBuffer(csvFile);
  } catch (error) {
    console.error('Error importing CSV:', error);
    showAlert('error', `Failed to import CSV file: ${error.message}`);
    setImportLoading(false);
  }
};
  // Download CSV template
  const downloadCSVTemplate = () => {
    const template = [
      {
        'Name': 'John Doe',
        'Contact': '08012345678',
        'Plot': 'A1, A2',
        'Date': '2024-01-15',
        'Price per Plot': '3000000, 4000000',
        'Initial Deposit': '1000000',
        'Payment Schedule': 'Monthly',
        'Number of Plots': '2'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'users_import_template.csv');
    showAlert('success', 'CSV template downloaded successfully.');
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
      });

      const data = await response.json();
      if (data.success) {
        showAlert("success", "User updated successfully.");
        setShowEditModal(false);
        fetchUsers();
      } else {
        showAlert("error", data.message || "Failed to update user.");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      showAlert("error", "Failed to update user.");
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'musabaha_users.xlsx');
    showAlert('success', 'Excel file downloaded successfully.');
  };

  const exportToPDF = async () => {
    try {
      let doc;
      if (window.jspdf) {
        const { jsPDF } = window.jspdf;
        doc = new jsPDF();
      } else {
        doc = new jsPDF();
      }

      const loadImageAsBase64 = async (path) => {
        try {
          const res = await fetch(path);
          const blob = await res.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.warn('Could not load logo image:', path);
          return null;
        }
      };

      const logo = await loadImageAsBase64("/images/MHL.jpg");

      if (logo) {
        doc.addImage(logo, "JPEG", 14, 5, 20, 20);
      }

      doc.setFontSize(18);
      doc.text('MUSABAHA HOMES LTD. - Users Report', logo ? 40 : 14, 15);
      
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, logo ? 40 : 14, 22);
      
      doc.setFontSize(10);
      doc.text(`Total Outstanding Balance: ${formatCurrency(totalBalance)}`, 14, logo ? 35 : 32);
      doc.text(`Total Plot Value: ${formatCurrency(totalPlotValue)}`, 14, logo ? 41 : 38);
      doc.text(`Total Deposits Received: ${formatCurrency(totalDeposits)}`, 14, logo ? 47 : 44);
      doc.text(`Total Plots Sold: ${totalPlotsSold}`, 14, logo ? 53 : 50);
      
      const tableData = users.map(user => [
        user.name || '',
        user.contact || '',
        user.plot_taken || '',
        user.date_taken || '',
        formatCurrency(calculateTotalPrice(user.price_per_plot)) || '',
        formatCurrency(user.initial_deposit) || '',
        user.price_per_plot ? user.price_per_plot.split(",").map(p => formatCurrency(p.trim())).join(", ") : '',
        user.payment_schedule || '',
        formatCurrency(user.total_balance) || '',
        user.number_of_plots || '1',
        user.status || ''
      ]);

      const startY = logo ? 60 : 55;

      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          head: [['Name', 'Contact', 'Plot Taken', 'Date Taken', 'Total Money to Pay', 'Initial Deposit', 'Price per Plot', 'Payment Schedule', 'Total Balance', 'Plots', 'Status']],
          body: tableData,
          startY: startY,
          styles: { 
            fontSize: 8,
            cellPadding: 1
          },
          headStyles: { 
            fillColor: [44, 62, 80],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240]
          },
          margin: { top: startY }
        });
      } else {
        createSimpleTable(doc, tableData, startY);
      }

      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('MUSABAHA HOMES LTD. - RC NO.: 8176032', 14, pageHeight - 15);
      doc.text('Contact: +2349064220705, +2349039108853, +2347038192719', 14, pageHeight - 10);

      doc.save('musabaha_users_report.pdf');
      showAlert('success', 'PDF report downloaded successfully.');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      showAlert('error', 'Failed to generate PDF. Please try again.');
    }
  };

  const createSimpleTable = (doc, tableData, startY = 50) => {
    const headers = ['Name', 'Contact', 'Plot Taken', 'Date Taken', 'Total Money to Pay', 'Initial Deposit', 'Price per Plot', 'Payment Schedule', 'Total Balance', 'Plots', 'Status'];
    let y = startY;
    
    doc.setFillColor(44, 62, 80);
    doc.setTextColor(255, 255, 255);
    doc.rect(14, y, 182, 10, 'F');
    
    let x = 14;
    headers.forEach((header, index) => {
      doc.text(header, x + 2, y + 7);
      x += index === 0 ? 30 : 20;
    });
    
    y += 10;
    
    doc.setTextColor(0, 0, 0);
    tableData.forEach((row, rowIndex) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      x = 14;
      row.forEach((cell, cellIndex) => {
        doc.text(cell.substring(0, 15), x + 2, y + 7);
        x += cellIndex === 0 ? 30 : 20;
      });
      
      y += 10;
    });
  };

  const calculateRemainingBalance = (user) => {
    const totalPlotPrice = calculateTotalPrice(user.price_per_plot);
    const totalSubsequentPayments = (user.payments || []).reduce(
      (sum, p) => sum + parseFloat(p.amount || 0),
      0
    );
    const initialDeposit = parseFloat(user.initial_deposit || 0);
    const totalPaid = initialDeposit + totalSubsequentPayments;
    
    return Math.max(0, totalPlotPrice - totalPaid);
  };

  const convertAmountToWords = (amount) => {
    let num = parseFloat(amount);
    if (isNaN(num)) return 'Invalid Amount';
    if (num === 0) return 'Zero Naira';
    
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const convertLessThanThousand = (n) => {
      if (n === 0) return '';
      let words = '';
      
      if (n >= 100) {
        words += units[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      
      if (n > 0) {
        if (n < 10) {
          words += units[n];
        } else if (n < 20) {
          words += teens[n - 10];
        } else {
          words += tens[Math.floor(n / 10)];
          if (n % 10 > 0) {
            words += ' ' + units[n % 10];
          }
        }
      }
      
      return words;
    };
    
    let words = '';
    let n = Math.floor(num);
    
    if (n >= 1000000) {
      words += convertLessThanThousand(Math.floor(n / 1000000)) + ' Million ';
      n %= 1000000;
    }
    
    if (n >= 1000) {
      words += convertLessThanThousand(Math.floor(n / 1000)) + ' Thousand ';
      n %= 1000;
    }
    
    if (n > 0) {
      words += convertLessThanThousand(n);
    }
    
    const kobo = Math.round((num - Math.floor(num)) * 100);
    if (kobo > 0) {
      words += ' Naira and ' + convertLessThanThousand(kobo) + ' Kobo';
    } else {
      words += ' Naira';
    }
    
    return words + ' Only';
  };

  const generateReceipt = async (payment, user) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [148.5, 210]
    });
 
    const loadImageAsBase64 = async (path) => {
      const res = await fetch(path);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };
 
    const logo = await loadImageAsBase64("/images/MHL.jpg");
    const bg = await loadImageAsBase64("/images/bg.jpg");
 
    doc.addImage(bg, "JPEG", 0, 20, 210, 148.5);
    doc.addImage(logo, "JPEG", 10, 17, 25, 25);
 
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("MUSABAHA HOMES LTD.", 40, 18);
 
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text("RC NO.: 8176032", 40, 24);
    doc.text("No. 015, City Plaza Along Ring Road Western Bypass", 40, 30);
    doc.text("Along Yankaba Road, Kano State", 40, 34);
    doc.text("TEL: +2349064220705, +2349039108853, +2347038192719", 40, 40);
    doc.text("Email: musabahohomesltd@gmail.com", 40, 44);
 
    doc.setFontSize(30);
    doc.setFont(undefined, "bold");
    doc.text("CASH RECEIPT", 105, 60, { align: "center" });
 
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text("No.:", 10, 70);
    doc.line(20, 70, 70, 70);
    doc.text(`${payment.id}`, 22, 69);
 
    doc.text("Date & Time:", 130, 70);
    doc.line(160, 70, 200, 70);
    doc.text(`${new Date(payment.date).toLocaleString("en-NG")}`, 162, 69);
 
    doc.setFont(undefined, "bold");
    doc.text("Received from:", 10, 85);
    doc.line(45, 85, 200, 85);
    doc.setFont(undefined, "normal");
    doc.text(user.name, 47, 84);
 
    const amountInWords = convertAmountToWords(payment.amount);
    const splitWords = doc.splitTextToSize(amountInWords, 150);
 
    doc.setFont(undefined, "bold");
    doc.text("The Sum of:", 10, 100);
    doc.line(40, 100, 200, 100);
    doc.setFont(undefined, "normal");
    doc.text(splitWords, 42, 99);
 
    doc.setFont(undefined, "bold");
    doc.text("Naira:", 120, 115);
    doc.line(140, 115, 200, 115);
    doc.setFont(undefined, "normal");
    doc.text(`${formatCurrency(payment.amount)}`, 142, 114);
 
    doc.setFont(undefined, "bold");
    doc.text("Being payment for:", 10, 125);
    doc.line(60, 125, 200, 125);
    doc.setFont(undefined, "normal");
    doc.text(`Plot(s): ${user.plot_taken} - ${payment.note || "Payment on account"}`, 62, 124);
 
    doc.setFont(undefined, "bold");
    doc.text("Recorded by:", 10, 140);
    doc.line(38, 140, 100, 140);
    doc.setFont(undefined, "normal");
    doc.text(payment.admin || payment.recorded_by || "Admin", 40, 139);
 
    doc.setFont(undefined, "bold");
    doc.text("Signature:", 150, 140);
    doc.line(170, 140, 200, 140);
 
    doc.setFontSize(8);
    doc.setFont(undefined, "italic");
    doc.text("For MUSABAHA HOMES LTD.", 170, 145);
 
    doc.save(`receipt_${user.name.replace(/\s+/g, "_")}_${payment.id}.pdf`);
    showAlert("success", "Receipt downloaded successfully.");
  };

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount || 0).toLocaleString('en-NG')}`;
  };

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Loading users...</p>
    </div>
  );
// Add this function before your return statement
const formatDateForDisplay = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    // Create date object and format to YYYY-MM-DD
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns "2025-10-16"
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};
  return (
    <div className="admin-content">
      <div className="content-header"> 
        <h2><FiUser className="icon" /> Client Management</h2>
        
        <div className="header-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="  ...Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="action-buttons">
            <div className="action-item import" onClick={() => setShowImportModal(true)}>
              <FiUpload className="icon" /> Import CSV
            </div>
            <div className="action-item excel" onClick={exportToExcel}>
              <FiDownload className="icon" /> Excel
            </div>
            <div className="action-item pdf" onClick={exportToPDF}>
              <FiFileText className="icon" /> PDF
            </div>
            <div className="action-item add-user" onClick={() => setShowCreateModal(true)}>
              <FiPlus className="icon" /> Add Client
            </div>
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon total-balance">
            <FiDollarSign />
          </div>
          <div className="summary-content">
            <h3>{formatCurrency(totalBalance)}</h3>
            <p>Total Outstanding Balance</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon total-value">
            <FiHome />
          </div>
          <div className="summary-content">
            <h3>{formatCurrency(totalPlotValue)}</h3>
            <p>Total Plot Value</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon deposits">
            <FiCreditCard />
          </div>
          <div className="summary-content">
            <h3>{formatCurrency(totalDeposits)}</h3>
            <p>Total Deposits Received</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon plots">
            <FiMapPin />
          </div>
          <div className="summary-content">
            <h3>{totalPlotsSold}</h3>
            <p>Total Plots Sold</p>
          </div>
        </div>
      </div>

<div className="content-table">
  <div className="table-container">
    <table className="user-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Contact</th>
          <th>Plot Taken</th>
          <th>Date Taken</th>
          <th>Total Money</th>
          <th>Deposit</th>
          <th>Price/Plot</th>
          <th>Schedule</th>
          <th>Balance</th>
          <th>Plots</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((user) => {
          // Safe price processing
          const priceArray = user.price_per_plot ? 
            user.price_per_plot.split(",").map(price => price.trim()) : 
            [];
          
          // Safe plot count calculation
          const plotCount = user.number_of_plots || 
            (user.plot_taken ? user.plot_taken.split(",").length : 1);

          return (
            <tr key={user.id}>
              <td>
                <div className="user-qinfo">
                  <span>{user.name}</span>
                </div>
              </td>
              <td>{user.contact}</td>
              <td>
                <div className="plot-info">
                  <span>{user.plot_taken || 'N/A'}</span>
                </div>
              </td>
              <td>{formatDateForDisplay(user.date_taken)}</td>
              <td>{formatCurrency(calculateTotalPrice(user.price_per_plot))}</td>
              <td>{formatCurrency(user.initial_deposit)}</td>
              <td>
                {priceArray.length > 0 ? (
                  priceArray.map((price, idx) => (
                    <span key={idx}>
                      {formatCurrency(price)}
                      {idx < priceArray.length - 1 && ", "}
                    </span>
                  ))
                ) : (
                  <span>N/A</span>
                )}
              </td>
              <td>
                <div className="payment-schedule">
                  <FiCalendar className="icon" />
                  <span>{user.payment_schedule || 'N/A'}</span>
                </div>
              </td>
              <td>
                <div
                  className={`balance ${
                    parseFloat(user.total_balance || 0) === 0 ? "paid" : ""
                  }`}
                >
                  {formatCurrency(user.total_balance || 0)}
                </div>
              </td>
              <td>
                <div className="plots-count-badge">
                  {plotCount}
                </div>
              </td>
              <td>
                <span className={`status-badge ${(user.status || 'active').toLowerCase()}`}>
                  {user.status === "Completed" && (
                    <FiCheckCircle className="icon" />
                  )}
                  {user.status || 'Active'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <FiEye
                    className="action-icon view"
                    onClick={() => handleViewUser(user)}
                  />
                  <FiEdit
                    className="action-icon edit"
                    onClick={() => handleEditUser(user)}
                  />
                  <FiTrash2
                    className="action-icon delete"
                    onClick={() => handleDeleteUser(user.id)}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content compact-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', width: '95vw' }}>
            <div className="modal-header">
              <h3><FiUserPlus className="icon" /> Register New Customer</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleCreateUser} className="user-creation-form compact-form">
                <div className="form-section compact-section">
                  <h4><FiUser className="icon" /> Customer Information</h4>
                  <div className="form-row compact-row">
                    <div className="form-group compact-group">
                      <label><FiUser className="icon" /> Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={newUser.name}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="form-group compact-group">
                      <label><FiPhone className="icon" /> Contact Number *</label>
                      <input
                        type="text"
                        name="contact"
                        value={newUser.contact}
                        onChange={handleInputChange}
                        placeholder="Phone number"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section compact-section">
                  <h4>
                    <FiMapPin className="icon" /> 
                    Plot Selection 
                    <span className="plots-count">({selectedPlots.length} selected)</span>
                  </h4>
                  
                  <div className="compact-plots-container">
                    <div className="plots-mini-grid">
                      {plots.slice(0, 6).map(plot => (
                        <div 
                          key={plot.id}
                          className={`plot-mini-card ${selectedPlots.some(p => p.id === plot.id) ? 'selected' : ''}`}
                          onClick={() => handlePlotSelection(plot)}
                          title={`Plot ${plot.number} - ${plot.location} - ${formatCurrency(plot.price)}`}
                        >
                          <span className="plot-mini-number">#{plot.number}</span>
                          <span className="plot-mini-price">{formatCurrency(plot.price)}</span>
                          {selectedPlots.some(p => p.id === plot.id) ? (
                            <FiCheckCircle className="selected-icon" />
                          ) : (
                            <FiCircle className="unselected-icon" />
                          )}
                        </div>
                      ))}
                      {plots.length > 6 && (
                        <div className="plot-more-indicator">
                          +{plots.length - 6} more
                        </div>
                      )}
                    </div>
                    
                    {selectedPlots.length > 0 && (
                      <div className="selected-plots-compact">
                        <div className="selected-plots-tags">
                          {selectedPlots.map(plot => (
                            <span key={plot.id} className="plot-tag">
                              Plot {plot.number}
                              <button 
                                type="button"
                                className="tag-remove"
                                onClick={() => handlePlotSelection(plot)}
                              >
                                <FiX size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="plots-total">
                          <span>Total Plots: {selectedPlots.length}</span>
                          <span>Total: {formatCurrency(selectedPlots.reduce((sum, plot) => sum + parseFloat(plot.price || 0), 0))}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-row compact-row">
                    <div className="form-group compact-group">
                      <label><FiCalendar className="icon" /> Acquisition Date *</label>
                      <input
                        type="date"
                        name="date_taken"
                        value={newUser.date_taken}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group compact-group">
                      <label><FiDatabase className="icon" /> Number of Plots</label>
                      <input
                        type="number"
                        name="number_of_plots"
                        value={newUser.number_of_plots}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                        disabled
                        className="disabled-input"
                      />
                    </div>
                  </div>
                </div>

<div className="form-section compact-section">
  <h4><FiDollarSign className="icon" /> Financial Details</h4>
  
  <div className="financial-grid">
    <div className="financial-item">
      <label>Plot Prices</label>
      <div className="price-display">
        {selectedPlots.length > 0 ? selectedPlots.map(plot => formatCurrency(plot.price)).join(', ') : 'No plots selected'}
      </div>
    </div>
    
    <div className="financial-item">
      <label>Total Price</label>
      <div className="amount-display total">
        {formatCurrency(calculateTotalPrice(newUser.price_per_plot))}
      </div>
    </div>
    
    <div className="financial-item">
      <label>Initial Deposit *</label>
      <input
        type="number"
        name="initial_deposit"
        value={newUser.initial_deposit}
        onChange={handleInputChange}
        placeholder="0"
        min="0"
        max={calculateTotalPrice(newUser.price_per_plot)}
        required
        className="deposit-input"
      />
    </div>
    
    <div className="financial-item">
      <label>Balance</label>
      <div className={`amount-display balance ${
        (calculateTotalPrice(newUser.price_per_plot) - parseFloat(newUser.initial_deposit || 0)) <= 0 
          ? 'paid' 
          : 'pending'
      }`}>
        {formatCurrency(calculateTotalPrice(newUser.price_per_plot) - parseFloat(newUser.initial_deposit || 0))}
        {(calculateTotalPrice(newUser.price_per_plot) - parseFloat(newUser.initial_deposit || 0)) <= 0 && (
          <span className="paid-badge">Paid</span>
        )}
      </div>
    </div>
  </div>

  <div className="form-group compact-group">
    <label><FiPieChart className="icon" /> Payment Schedule *</label>
    <select
      name="payment_schedule"
      value={newUser.payment_schedule}
      onChange={handleInputChange}
      required
      className="schedule-select"
    >
      <option value="">Select Payment Terms</option>
      <option value="3 Months">3 Months</option>
      <option value="12 Months">12 Months</option>
      <option value="18 Months">18 Months</option>
      <option value="24 Months">24 Months</option>
      <option value="30 Months">30 Months</option>
    </select>
  </div>
</div>

                <div className="modal-footer compact-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowCreateModal(false);
                      setSelectedPlots([]);
                    }}
                  >
                    <FiX className="icon" /> Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={selectedPlots.length === 0}
                  >
                    <FiUserPlus className="icon" /> Register Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiEdit className="icon" /> Edit User</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateUser}>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editUser.name}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contact *</label>
                  <input
                    type="text"
                    name="contact"
                    value={editUser.contact}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Plot Taken *</label>
                  <input
                    type="text"
                    name="plot_taken"
                    value={editUser.plot_taken}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date Taken *</label>
                  <input
                    type="date"
                    name="date_taken"
                    value={editUser.date_taken}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price per Plot *</label>
                  <input
                    type="text"
                    name="price_per_plot"
                    value={editUser.price_per_plot}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Initial Deposit *</label>
                  <input
                    type="number"
                    name="initial_deposit"
                    value={editUser.initial_deposit}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Number of Plots</label>
                  <input
                    type="number"
                    name="number_of_plots"
                    value={editUser.number_of_plots || 1}
                    onChange={handleEditInputChange}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Payment Schedule *</label>
                  <select
                    name="payment_schedule"
                    value={editUser.payment_schedule}
                    onChange={handleEditInputChange}
                    required
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Bi-Annual">Bi-Annual</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiUser className="icon" /> User Details: {selectedUser.name}</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="user-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Contact:</label>
                    <span>{selectedUser.contact}</span>
                  </div>
                  <div className="detail-item">
                    <label>Plot Taken:</label>
                    <span>{selectedUser.plot_taken}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Date Taken:</label>
                    <span>{selectedUser.date_taken}</span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Schedule:</label>
                    <span>{selectedUser.payment_schedule}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Total Price:</label>
                    <span className="total-price">{formatCurrency(calculateTotalPrice(selectedUser.price_per_plot))}</span>
                  </div>
                  <div className="detail-item">
                    <label>Initial Deposit:</label>
                    <span className="deposit">{formatCurrency(selectedUser.initial_deposit)}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Number of Plots:</label>
                    <span className="plots-count">{selectedUser.number_of_plots || 1}</span>
                  </div>
                </div>
                
                {selectedUser.payments && (
                  <div className="payment-summary">
                    <div className="summary-row">
                      <label>Total Subsequent Payments:</label>
                      <span>{formatCurrency(selectedUser.payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0))}</span>
                    </div>
                    <div className="summary-row">
                      <label>Total Paid (Deposit + Payments):</label>
                      <span className="total-paid">
                        {formatCurrency(parseFloat(selectedUser.initial_deposit || 0) + selectedUser.payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0))}
                      </span>
                    </div>
                    <div className="summary-row outstanding">
                      <label>Outstanding Balance:</label>
                      <span className={calculateRemainingBalance(selectedUser) === 0 ? 'paid' : 'pending'}>
                        {formatCurrency(calculateRemainingBalance(selectedUser))}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${selectedUser.status.toLowerCase()}`}>
                      {selectedUser.status === 'Completed' && <FiCheckCircle className="icon" />}
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="payment-section">
                <h4><FiDollarSign className="icon" /> Payment History</h4>
                {selectedUser.payments && selectedUser.payments.map(payment => (
                  <div key={payment.id} className="payment-item">
                    <div className="payment-info">
                      <div className="payment-date">
                        <FiClock className="icon" /> 
                        {formatDateTime(payment.date)}
                      </div>
                      <div className="payment-note">{payment.note}</div>
                      <div className="payment-admin">Recorded by: {payment.admin || payment.recorded_by || "Admin"}</div>
                    </div>
                    <div className="payment-actions">
                      <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => generateReceipt(payment, selectedUser)}
                        title="Download Receipt"
                      >
                        <FiFileText />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="add-payment-section">
                <h4><FiPlus className="icon" /> Add New Payment</h4>
                <div className="payment-form">
                  <div className="form-group">
                    <label>Amount (₦) *</label>
                    <input
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                      required
                      placeholder="Enter payment amount"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date & Time</label>
                    <input
                      type="datetime-local"
                      value={paymentData.date}
                      onChange={(e) => setPaymentData({...paymentData, date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Note</label>
                    <input
                      type="text"
                      value={paymentData.note}
                      onChange={(e) => setPaymentData({...paymentData, note: e.target.value})}
                      placeholder="Payment note (e.g., Monthly installment)"
                    />
                  </div>
                  <div className="form-group">
                    <label>Recorded By</label>
                    <input
                      type="text"
                      value={paymentData.admin}
                      onChange={(e) => setPaymentData({...paymentData, admin: e.target.value})}
                      placeholder="Admin name"
                    />
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAddPayment(selectedUser.id)}
                    disabled={!paymentData.amount}
                  >
                    Add Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiUpload className="icon" /> Import Users from CSV</h3>
              <button className="modal-close" onClick={() => setShowImportModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="import-instructions">
                <h4>CSV Format Requirements:</h4>
                <ul>
                  <li>File must be in CSV format</li>
                  <li>Include these columns: <strong>Name, Contact, Plot, Date, Price per Plot, Initial Deposit, Payment Schedule, Number of Plots</strong></li>
                  <li>Date format: YYYY-MM-DD</li>
                  <li>Multiple plots: Separate with commas (e.g., "A1, A2")</li>
                  <li>Multiple prices: Separate with commas (e.g., "3000000, 4000000")</li>
                </ul>
                
                <div className="template-download">
                  <button 
                    className="btn btn-secondary" 
                    onClick={downloadCSVTemplate}
                  >
                    <FiDownload className="icon" /> Download Template
                  </button>
                </div>
              </div>

              <div className="file-upload-section">
                <label className="file-upload-label">
                  <FiUpload className="icon" />
                  Choose CSV File
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="file-input"
                  />
                </label>
                {csvFile && (
                  <div className="file-info">
                    <FiFileText className="icon" />
                    <span>{csvFile.name}</span>
                    <span>({(csvFile.size / 1024).toFixed(2)} KB)</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowImportModal(false)}
                disabled={importLoading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleImportCSV}
                disabled={!csvFile || importLoading}
              >
                {importLoading ? 'Importing...' : 'Import Users'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete.visible && (
        <div className="modal-overlay" onClick={() => setConfirmDelete({ visible: false, userId: null })}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header danger">
              <h3><FiTrash2 className="icon" /> Confirm Delete</h3>
              <button 
                className="modal-close" 
                onClick={() => setConfirmDelete({ visible: false, userId: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this user? <strong>This action cannot be undone.</strong></p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-danger" 
                onClick={confirmDeleteUser}
              >
                <FiTrash2 className="icon" /> Yes, Delete
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setConfirmDelete({ visible: false, userId: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;