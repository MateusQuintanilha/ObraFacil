import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ServiceType } from '@/models/shared/serviceTypes';

export const serviceIcons: Record<ServiceType, React.ReactNode> = {
  [ServiceType.Alvenaria]: <FontAwesome5 name="tools" size={16} color="#2d2d2d" />,
  [ServiceType.ReparoGeral]: <FontAwesome5 name="wrench" size={16} color="#2d2d2d" />,
  [ServiceType.Pintura]: <Ionicons name="color-palette" size={16} color="#2d2d2d" />,
  [ServiceType.Hidraulica]: <FontAwesome5 name="water" size={16} color="#2d2d2d" />,
  [ServiceType.Eletrica]: <MaterialIcons name="electrical-services" size={16} color="#2d2d2d" />,
  [ServiceType.Montagem]: <FontAwesome5 name="cogs" size={16} color="#2d2d2d" />,
  [ServiceType.Manutencao]: <FontAwesome5 name="tools" size={16} color="#2d2d2d" />,
  [ServiceType.ManutencaoGeral]: <FontAwesome5 name="toolbox" size={16} color="#2d2d2d" />,
  [ServiceType.Jardinagem]: <Entypo name="leaf" size={16} color="#2d2d2d" />,
  [ServiceType.Limpeza]: <FontAwesome name="trash" size={16} color="#2d2d2d" />,
  [ServiceType.Impermeabilizacao]: <MaterialIcons name="water-damage" size={16} color="#2d2d2d" />,
  [ServiceType.Reforma]: <FontAwesome5 name="paint-roller" size={16} color="#2d2d2d" />,
  [ServiceType.Telhado]: <MaterialCommunityIcons name="home-roof" size={16} color="#2d2d2d" />,
  [ServiceType.Marcenaria]: <MaterialCommunityIcons name="saw-blade" size={16} color="#2d2d2d" />,
  [ServiceType.GessoDrywall]: <MaterialCommunityIcons name="wall" size={16} color="#2d2d2d" />,
  [ServiceType.Instalacao]: <Entypo name="tools" size={16} color="#2d2d2d" />,
  [ServiceType.Demolicao]: <MaterialCommunityIcons name="hammer" size={16} color="#2d2d2d" />,
  [ServiceType.Outros]: <MaterialIcons name="more-horiz" size={16} color="#2d2d2d" />,
};
