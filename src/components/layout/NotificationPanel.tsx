'use client';

import { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck, Info, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/lib/actions/notifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string | null;
  createdAt: Date;
}

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getIcon = (type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => {
    switch (type) {
      case 'SUCCESS':
        return <Check className="h-5 w-5 text-green-600" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'ERROR':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return 'bg-green-500/10';
      case 'WARNING':
        return 'bg-orange-500/10';
      case 'ERROR':
        return 'bg-red-500/10';
      default:
        return 'bg-blue-500/10';
    }
  };

  const getSidebarColor = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return 'bg-green-600';
      case 'WARNING':
        return 'bg-orange-600';
      case 'ERROR':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-96 max-h-[600px] flex flex-col bg-card rounded-lg shadow-lg border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Tout marquer lu
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-muted-foreground">Chargement...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <Bell className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Aucune notification
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative flex gap-3 hover:bg-muted/50 transition-colors rounded-xl ${
                  !notification.read ? 'bg-primary/5' : 'bg-card'
                }`}
              >
                <div className="flex gap-3 p-4 flex-1">
                  <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {notification.actionUrl && (
                      <Button
                        variant="link"
                        size="sm"
                        className="mt-2 h-auto p-0 text-xs text-[#F2C086]"
                        onClick={() => {
                          window.location.href = notification.actionUrl!;
                        }}
                      >
                        Voir →
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

