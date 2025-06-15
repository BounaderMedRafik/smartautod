import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Hammer } from 'lucide-react-native';
import { useLanguage } from '@/context/LanguageContext';
import { Mechanics, ShopsProps } from '@/types';
import { carShops, mockMechanics } from '@/types/db';

export default function MechanicsScreen() {
  const { lang } = useLanguage();
  const [mechanics, setMechanics] = useState<Mechanics[]>([]);
  const [shops, setShops] = useState<ShopsProps[]>(carShops);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanics | null>(
    null
  );
  const [selectedShop, setSelectedShop] = useState<ShopsProps | null>(null);
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tab, setTab] = useState<'mechanics' | 'shops'>('mechanics');

  useEffect(() => {
    setMechanics(mockMechanics);
    setShops(carShops);
  }, []);

  const openContactModal = (
    type: 'mechanic' | 'shop',
    item: Mechanics | ShopsProps
  ) => {
    setMessage('');
    setModalVisible(true);
    if (type === 'mechanic') {
      setSelectedMechanic(item as Mechanics);
      setSelectedShop(null);
    } else {
      setSelectedShop(item as ShopsProps);
      setSelectedMechanic(null);
    }
  };

  const handleSendMessage = () => {
    setModalVisible(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getModalTitle = () => {
    const name = selectedMechanic?.name || selectedShop?.name || '';
    return lang === 'eng'
      ? `Message to ${name}`
      : lang === 'fr'
      ? `Message à ${name}`
      : `رسالة إلى ${name}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>
        {lang === 'eng'
          ? 'Nearby Services'
          : lang === 'fr'
          ? 'Services Proches'
          : 'الخدمات القريبة'}
      </Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'mechanics' && styles.activeTab]}
          onPress={() => setTab('mechanics')}
        >
          <Text style={styles.tabText}>
            {lang === 'eng'
              ? 'Mechanics'
              : lang === 'fr'
              ? 'Mécaniciens'
              : 'الميكانيكيون'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'shops' && styles.activeTab]}
          onPress={() => setTab('shops')}
        >
          <Text style={styles.tabText}>
            {lang === 'eng'
              ? 'Shops'
              : lang === 'fr'
              ? 'Boutiques'
              : 'محلات قطع الغيار'}
          </Text>
        </TouchableOpacity>
      </View>

      {showSuccess && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>
            {lang === 'eng'
              ? 'Message sent successfully!'
              : lang === 'fr'
              ? 'Message envoyé avec succès !'
              : 'تم إرسال الرسالة بنجاح!'}
          </Text>
        </View>
      )}

      {/* Mechanics */}
      {tab === 'mechanics' &&
        mechanics.map((mech, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: mech.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{mech.name}</Text>
              <Text style={styles.description}>{mech.description}</Text>
              <Text style={styles.meta}>{mech.phonenum}</Text>
              <Text style={styles.meta}>{mech.location}</Text>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => openContactModal('mechanic', mech)}
              >
                <Text style={styles.messageText}>
                  {lang === 'eng'
                    ? 'Send Message'
                    : lang === 'fr'
                    ? 'Envoyer un message'
                    : 'إرسال رسالة'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      {/* Shops */}
      {tab === 'shops' &&
        shops.map((shop, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: shop.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{shop.name}</Text>
              <Text style={styles.description}>{shop.description}</Text>
              <Text style={styles.meta}>{shop.phonenum}</Text>
              <Text style={styles.meta}>{shop.location}</Text>
              <Text style={styles.meta}>
                {lang === 'eng'
                  ? `Open: ${shop.openTime} - ${shop.closeTime}`
                  : lang === 'fr'
                  ? `Ouvert : ${shop.openTime} - ${shop.closeTime}`
                  : `مفتوح: ${shop.openTime} - ${shop.closeTime}`}
              </Text>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => openContactModal('shop', shop)}
              >
                <Text style={styles.messageText}>
                  {lang === 'eng'
                    ? 'Contact Shop'
                    : lang === 'fr'
                    ? 'Contacter la boutique'
                    : 'اتصل بالمحل'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      {/* Message Modal (Mechanic or Shop) */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{getModalTitle()}</Text>
            <TextInput
              style={styles.input}
              placeholder={
                lang === 'eng'
                  ? 'Type your message'
                  : lang === 'fr'
                  ? 'Tapez votre message'
                  : 'اكتب رسالتك'
              }
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Text style={styles.sendText}>
                {lang === 'eng' ? 'Send' : lang === 'fr' ? 'Envoyer' : 'إرسال'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    color: '#111827',
    fontFamily: 'Inter-Medium',
  },
  successBanner: {
    backgroundColor: '#D1FAE5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  successText: {
    color: '#065F46',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  meta: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#9CA3AF',
  },
  messageButton: {
    marginTop: 10,
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#FFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 24,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#1F2937',
  },
  input: {
    height: 80,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendText: {
    color: '#FFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeText: {
    fontSize: 18,
    color: '#374151',
    fontFamily: 'Inter-Bold',
  },
});
