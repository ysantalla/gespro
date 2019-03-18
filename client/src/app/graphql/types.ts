export interface RoleWhereInput {
  id?: string | null;

  id_not?: string | null;

  id_in?: string[] | null;

  id_not_in?: string[] | null;

  id_lt?: string | null;

  id_lte?: string | null;

  id_gt?: string | null;

  id_gte?: string | null;

  id_contains?: string | null;

  id_not_contains?: string | null;

  id_starts_with?: string | null;

  id_not_starts_with?: string | null;

  id_ends_with?: string | null;

  id_not_ends_with?: string | null;

  name?: string | null;

  name_not?: string | null;

  name_in?: string[] | null;

  name_not_in?: string[] | null;

  name_lt?: string | null;

  name_lte?: string | null;

  name_gt?: string | null;

  name_gte?: string | null;

  name_contains?: string | null;

  name_not_contains?: string | null;

  name_starts_with?: string | null;

  name_not_starts_with?: string | null;

  name_ends_with?: string | null;

  name_not_ends_with?: string | null;

  description?: string | null;

  description_not?: string | null;

  description_in?: string[] | null;

  description_not_in?: string[] | null;

  description_lt?: string | null;

  description_lte?: string | null;

  description_gt?: string | null;

  description_gte?: string | null;

  description_contains?: string | null;

  description_not_contains?: string | null;

  description_starts_with?: string | null;

  description_not_starts_with?: string | null;

  description_ends_with?: string | null;

  description_not_ends_with?: string | null;

  users_every?: UserWhereInput | null;

  users_some?: UserWhereInput | null;

  users_none?: UserWhereInput | null;

  AND?: RoleWhereInput[] | null;

  OR?: RoleWhereInput[] | null;

  NOT?: RoleWhereInput[] | null;
}

export interface UserWhereInput {
  id?: string | null;

  id_not?: string | null;

  id_in?: string[] | null;

  id_not_in?: string[] | null;

  id_lt?: string | null;

  id_lte?: string | null;

  id_gt?: string | null;

  id_gte?: string | null;

  id_contains?: string | null;

  id_not_contains?: string | null;

  id_starts_with?: string | null;

  id_not_starts_with?: string | null;

  id_ends_with?: string | null;

  id_not_ends_with?: string | null;

  username?: string | null;

  username_not?: string | null;

  username_in?: string[] | null;

  username_not_in?: string[] | null;

  username_lt?: string | null;

  username_lte?: string | null;

  username_gt?: string | null;

  username_gte?: string | null;

  username_contains?: string | null;

  username_not_contains?: string | null;

  username_starts_with?: string | null;

  username_not_starts_with?: string | null;

  username_ends_with?: string | null;

  username_not_ends_with?: string | null;

  email?: string | null;

  email_not?: string | null;

  email_in?: string[] | null;

  email_not_in?: string[] | null;

  email_lt?: string | null;

  email_lte?: string | null;

  email_gt?: string | null;

  email_gte?: string | null;

  email_contains?: string | null;

  email_not_contains?: string | null;

  email_starts_with?: string | null;

  email_not_starts_with?: string | null;

  email_ends_with?: string | null;

  email_not_ends_with?: string | null;

  firstname?: string | null;

  firstname_not?: string | null;

  firstname_in?: string[] | null;

  firstname_not_in?: string[] | null;

  firstname_lt?: string | null;

  firstname_lte?: string | null;

  firstname_gt?: string | null;

  firstname_gte?: string | null;

  firstname_contains?: string | null;

  firstname_not_contains?: string | null;

  firstname_starts_with?: string | null;

  firstname_not_starts_with?: string | null;

  firstname_ends_with?: string | null;

  firstname_not_ends_with?: string | null;

  lastname?: string | null;

  lastname_not?: string | null;

  lastname_in?: string[] | null;

  lastname_not_in?: string[] | null;

  lastname_lt?: string | null;

  lastname_lte?: string | null;

  lastname_gt?: string | null;

  lastname_gte?: string | null;

  lastname_contains?: string | null;

  lastname_not_contains?: string | null;

  lastname_starts_with?: string | null;

  lastname_not_starts_with?: string | null;

  lastname_ends_with?: string | null;

  lastname_not_ends_with?: string | null;

  fullname?: string | null;

  fullname_not?: string | null;

  fullname_in?: string[] | null;

  fullname_not_in?: string[] | null;

  fullname_lt?: string | null;

  fullname_lte?: string | null;

  fullname_gt?: string | null;

  fullname_gte?: string | null;

  fullname_contains?: string | null;

  fullname_not_contains?: string | null;

  fullname_starts_with?: string | null;

  fullname_not_starts_with?: string | null;

  fullname_ends_with?: string | null;

  fullname_not_ends_with?: string | null;

  employeeNumber?: string | null;

  employeeNumber_not?: string | null;

  employeeNumber_in?: string[] | null;

  employeeNumber_not_in?: string[] | null;

  employeeNumber_lt?: string | null;

  employeeNumber_lte?: string | null;

  employeeNumber_gt?: string | null;

  employeeNumber_gte?: string | null;

  employeeNumber_contains?: string | null;

  employeeNumber_not_contains?: string | null;

  employeeNumber_starts_with?: string | null;

  employeeNumber_not_starts_with?: string | null;

  employeeNumber_ends_with?: string | null;

  employeeNumber_not_ends_with?: string | null;

  roles_every?: RoleWhereInput | null;

  roles_some?: RoleWhereInput | null;

  roles_none?: RoleWhereInput | null;

  integrantes_every?: IntegranteWhereInput | null;

  integrantes_some?: IntegranteWhereInput | null;

  integrantes_none?: IntegranteWhereInput | null;

  AND?: UserWhereInput[] | null;

  OR?: UserWhereInput[] | null;

  NOT?: UserWhereInput[] | null;
}

export interface IntegranteWhereInput {
  id?: string | null;

  id_not?: string | null;

  id_in?: string[] | null;

  id_not_in?: string[] | null;

  id_lt?: string | null;

  id_lte?: string | null;

  id_gt?: string | null;

  id_gte?: string | null;

  id_contains?: string | null;

  id_not_contains?: string | null;

  id_starts_with?: string | null;

  id_not_starts_with?: string | null;

  id_ends_with?: string | null;

  id_not_ends_with?: string | null;

  usuario?: UserWhereInput | null;

  proyecto?: ProyectoWhereInput | null;

  jefeProyecto?: boolean | null;

  jefeProyecto_not?: boolean | null;

  pagos_every?: PagoWhereInput | null;

  pagos_some?: PagoWhereInput | null;

  pagos_none?: PagoWhereInput | null;

  AND?: IntegranteWhereInput[] | null;

  OR?: IntegranteWhereInput[] | null;

  NOT?: IntegranteWhereInput[] | null;
}

export interface ProyectoWhereInput {
  id?: string | null;

  id_not?: string | null;

  id_in?: string[] | null;

  id_not_in?: string[] | null;

  id_lt?: string | null;

  id_lte?: string | null;

  id_gt?: string | null;

  id_gte?: string | null;

  id_contains?: string | null;

  id_not_contains?: string | null;

  id_starts_with?: string | null;

  id_not_starts_with?: string | null;

  id_ends_with?: string | null;

  id_not_ends_with?: string | null;

  codigo?: string | null;

  codigo_not?: string | null;

  codigo_in?: string[] | null;

  codigo_not_in?: string[] | null;

  codigo_lt?: string | null;

  codigo_lte?: string | null;

  codigo_gt?: string | null;

  codigo_gte?: string | null;

  codigo_contains?: string | null;

  codigo_not_contains?: string | null;

  codigo_starts_with?: string | null;

  codigo_not_starts_with?: string | null;

  codigo_ends_with?: string | null;

  codigo_not_ends_with?: string | null;

  nombre?: string | null;

  nombre_not?: string | null;

  nombre_in?: string[] | null;

  nombre_not_in?: string[] | null;

  nombre_lt?: string | null;

  nombre_lte?: string | null;

  nombre_gt?: string | null;

  nombre_gte?: string | null;

  nombre_contains?: string | null;

  nombre_not_contains?: string | null;

  nombre_starts_with?: string | null;

  nombre_not_starts_with?: string | null;

  nombre_ends_with?: string | null;

  nombre_not_ends_with?: string | null;

  inicia?: DateTime | null;

  inicia_not?: DateTime | null;

  inicia_in?: DateTime[] | null;

  inicia_not_in?: DateTime[] | null;

  inicia_lt?: DateTime | null;

  inicia_lte?: DateTime | null;

  inicia_gt?: DateTime | null;

  inicia_gte?: DateTime | null;

  finaliza?: DateTime | null;

  finaliza_not?: DateTime | null;

  finaliza_in?: DateTime[] | null;

  finaliza_not_in?: DateTime[] | null;

  finaliza_lt?: DateTime | null;

  finaliza_lte?: DateTime | null;

  finaliza_gt?: DateTime | null;

  finaliza_gte?: DateTime | null;

  area?: AreaWhereInput | null;

  tipo?: TipoWhereInput | null;

  linea?: LineaWhereInput | null;

  eje?: EjeWhereInput | null;

  alcance?: AlcanceWhereInput | null;

  estado?: Estado | null;

  estado_not?: Estado | null;

  estado_in?: Estado[] | null;

  estado_not_in?: Estado[] | null;

  integrantes_every?: IntegranteWhereInput | null;

  integrantes_some?: IntegranteWhereInput | null;

  integrantes_none?: IntegranteWhereInput | null;

  AND?: ProyectoWhereInput[] | null;

  OR?: ProyectoWhereInput[] | null;

  NOT?: ProyectoWhereInput[] | null;
}

export interface AreaWhereInput {
  id?: string | null;

  id_not?: string | null;

  id_in?: string[] | null;

  id_not_in?: string[] | null;

  id_lt?: string | null;

  id_lte?: string | null;

  id_gt?: string | null;

  id_gte?: string | null;

  id_contains?: string | null;

  id_not_contains?: string | null;

  id_starts_with?: string | null;

  id_not_starts_with?: string | null;

  id_ends_with?: string | null;

  id_not_ends_with?: string | null;

  nombre?: string | null;

  nombre_not?: string | null;

  nombre_in?: string[] | null;

  nombre_not_in?: string[] | null;

  nombre_lt?: string | null;

  nombre_lte?: string | null;

  nombre_gt?: string | null;

  nombre_gte?: string | null;

  nombre_contains?: string | null;

  nombre_not_contains?: string | null;

  nombre_starts_with?: string | null;

  nombre_not_starts_with?: string | null;

  nombre_ends_with?: string | null;

  nombre_not_ends_with?: string | null;

  AND?: AreaWhereInput[] | null;

  OR?: AreaWhereInput[] | null;

  NOT?: AreaWhereInput[] | null;
}

export interface TipoWhereInput {
  id?: string | null;

  id_not?: string | null;

  id_in?: string[] | null;

  id_not_in?: string[] | null;

  id_lt?: string | null;

  id_lte?: string | null;

  id_gt?: string | null;

  id_gte?: string | null;

  id_contains?: string | null;

  id_not_contains?: string | null;

  id_starts_with?: string | null;

  id_not_starts_with?: string | null;

  id_ends_with?: string | null;

  id_not_ends_with?: string | null;

  nombre?: string | null;

  nombre_not?: string | null;

  nombre_in?: string[] | null;

  nombre_not_in?: string[] | null;

  nombre_lt?: string | null;

  nombre_lte?: string | null;

  nombre_gt?: string | null;

  nombre_gte?: string | null;

  nombre_contains?: string | null;

  nombre_not_contains?: string | null;

  nombre_starts_with?: string | null;

  nombre_not_starts_with?: string | null;

  nombre_ends_with?: string | null;

  nombre_not_ends_with?: string | null;

  AND?: TipoWhereInput[] | null;

  OR?: TipoWhereInput[] | null;

  NOT?: TipoWhereInput[] | null;
}

export interface LineaWhereInput {
  id?: string | null;

  id_not?: string | null;

  id_in?: string[] | null;

  id_not_in?: string[] | null;

  id_lt?: string | null;

  id_lte?: string | null;

  id_gt?: string | null;

  id_gte?: string | null;

  id_contains?: string | null;

  id_not_contains?: string | null;

  id_starts_with?: string | null;

  id_not_starts_with?: string | null;

  id_ends_with?: string | null;

  id_not_ends_with?: string | null;

  nombre?: string | null;

  nombre_not?: string | null;

  nombre_in?: string[] | null;

  nombre_not_in?: string[] | null;

  nombre_lt?: string | null;

  nombre_lte?: string | null;

  nombre_gt?: string | null;

  nombre_gte?: string | null;

  nombre_contains?: string | null;

  nombre_not_contains?: string | null;

  nombre_starts_with?: string | null;

  nombre_not_starts_with?: string | null;

  nombre_ends_with?: string | null;

  nombre_not_ends_with?: string | null;

  AND?: LineaWhereInput[] | null;

  OR?: LineaWhereInput[] | null;

  NOT?: LineaWhereInput[] | null;
}

export interface EjeWhereInput {
  id?: string | null;

  id_not?: string | null;

  id_in?: string[] | null;

  id_not_in?: string[] | null;

  id_lt?: string | null;

  id_lte?: string | null;

  id_gt?: string | null;

  id_gte?: string | null;

  id_contains?: string | null;

  id_not_contains?: string | null;

  id_starts_with?: string | null;

  id_not_starts_with?: string | null;

  id_ends_with?: string | null;

  id_not_ends_with?: string | null;

  nombre?: string | null;

  nombre_not?: string | null;

  nombre_in?: string[] | null;

  nombre_not_in?: string[] | null;

  nombre_lt?: string | null;

  nombre_lte?: string | null;

  nombre_gt?: string | null;

  nombre_gte?: string | null;

  nombre_contains?: string | null;

  nombre_not_contains?: string | null;

  nombre_starts_with?: string | null;

  nombre_not_starts_with?: string | null;

  nombre_ends_with?: string | null;

  nombre_not_ends_with?: string | null;

  AND?: EjeWhereInput[] | null;

  OR?: EjeWhereInput[] | null;

  NOT?: EjeWhereInput[] | null;
}

export interface AlcanceWhereInput {
  id?: string | null;

  id_not?: string | null;

  id_in?: string[] | null;

  id_not_in?: string[] | null;

  id_lt?: string | null;

  id_lte?: string | null;

  id_gt?: string | null;

  id_gte?: string | null;

  id_contains?: string | null;

  id_not_contains?: string | null;

  id_starts_with?: string | null;

  id_not_starts_with?: string | null;

  id_ends_with?: string | null;

  id_not_ends_with?: string | null;

  nombre?: string | null;

  nombre_not?: string | null;

  nombre_in?: string[] | null;

  nombre_not_in?: string[] | null;

  nombre_lt?: string | null;

  nombre_lte?: string | null;

  nombre_gt?: string | null;

  nombre_gte?: string | null;

  nombre_contains?: string | null;

  nombre_not_contains?: string | null;

  nombre_starts_with?: string | null;

  nombre_not_starts_with?: string | null;

  nombre_ends_with?: string | null;

  nombre_not_ends_with?: string | null;

  valor?: number | null;

  valor_not?: number | null;

  valor_in?: number[] | null;

  valor_not_in?: number[] | null;

  valor_lt?: number | null;

  valor_lte?: number | null;

  valor_gt?: number | null;

  valor_gte?: number | null;

  AND?: AlcanceWhereInput[] | null;

  OR?: AlcanceWhereInput[] | null;

  NOT?: AlcanceWhereInput[] | null;
}

export interface PagoWhereInput {
  id?: string | null;

  id_not?: string | null;

  id_in?: string[] | null;

  id_not_in?: string[] | null;

  id_lt?: string | null;

  id_lte?: string | null;

  id_gt?: string | null;

  id_gte?: string | null;

  id_contains?: string | null;

  id_not_contains?: string | null;

  id_starts_with?: string | null;

  id_not_starts_with?: string | null;

  id_ends_with?: string | null;

  id_not_ends_with?: string | null;

  integrante?: IntegranteWhereInput | null;

  mes?: MesWhereInput | null;

  anno?: AnnoWhereInput | null;

  horas?: number | null;

  horas_not?: number | null;

  horas_in?: number[] | null;

  horas_not_in?: number[] | null;

  horas_lt?: number | null;

  horas_lte?: number | null;

  horas_gt?: number | null;

  horas_gte?: number | null;

  presencia?: number | null;

  presencia_not?: number | null;

  presencia_in?: number[] | null;

  presencia_not_in?: number[] | null;

  presencia_lt?: number | null;

  presencia_lte?: number | null;

  presencia_gt?: number | null;

  presencia_gte?: number | null;

  incidencia?: number | null;

  incidencia_not?: number | null;

  incidencia_in?: number[] | null;

  incidencia_not_in?: number[] | null;

  incidencia_lt?: number | null;

  incidencia_lte?: number | null;

  incidencia_gt?: number | null;

  incidencia_gte?: number | null;

  relevancia?: number | null;

  relevancia_not?: number | null;

  relevancia_in?: number[] | null;

  relevancia_not_in?: number[] | null;

  relevancia_lt?: number | null;

  relevancia_lte?: number | null;

  relevancia_gt?: number | null;

  relevancia_gte?: number | null;

  complejidad?: number | null;

  complejidad_not?: number | null;

  complejidad_in?: number[] | null;

  complejidad_not_in?: number[] | null;

  complejidad_lt?: number | null;

  complejidad_lte?: number | null;

  complejidad_gt?: number | null;

  complejidad_gte?: number | null;

  gestion?: number | null;

  gestion_not?: number | null;

  gestion_in?: number[] | null;

  gestion_not_in?: number[] | null;

  gestion_lt?: number | null;

  gestion_lte?: number | null;

  gestion_gt?: number | null;

  gestion_gte?: number | null;

  vinculacion?: number | null;

  vinculacion_not?: number | null;

  vinculacion_in?: number[] | null;

  vinculacion_not_in?: number[] | null;

  vinculacion_lt?: number | null;

  vinculacion_lte?: number | null;

  vinculacion_gt?: number | null;

  vinculacion_gte?: number | null;

  calidad?: number | null;

  calidad_not?: number | null;

  calidad_in?: number[] | null;

  calidad_not_in?: number[] | null;

  calidad_lt?: number | null;

  calidad_lte?: number | null;

  calidad_gt?: number | null;

  calidad_gte?: number | null;

  significacion?: number | null;

  significacion_not?: number | null;

  significacion_in?: number[] | null;

  significacion_not_in?: number[] | null;

  significacion_lt?: number | null;

  significacion_lte?: number | null;

  significacion_gt?: number | null;

  significacion_gte?: number | null;

  cumplimiento?: number | null;

  cumplimiento_not?: number | null;

  cumplimiento_in?: number[] | null;

  cumplimiento_not_in?: number[] | null;

  cumplimiento_lt?: number | null;

  cumplimiento_lte?: number | null;

  cumplimiento_gt?: number | null;

  cumplimiento_gte?: number | null;

  calculo?: number | null;

  calculo_not?: number | null;

  calculo_in?: number[] | null;

  calculo_not_in?: number[] | null;

  calculo_lt?: number | null;

  calculo_lte?: number | null;

  calculo_gt?: number | null;

  calculo_gte?: number | null;

  AND?: PagoWhereInput[] | null;

  OR?: PagoWhereInput[] | null;

  NOT?: PagoWhereInput[] | null;
}

export interface MesWhereInput {
  id?: string | null;

  id_not?: string | null;

  id_in?: string[] | null;

  id_not_in?: string[] | null;

  id_lt?: string | null;

  id_lte?: string | null;

  id_gt?: string | null;

  id_gte?: string | null;

  id_contains?: string | null;

  id_not_contains?: string | null;

  id_starts_with?: string | null;

  id_not_starts_with?: string | null;

  id_ends_with?: string | null;

  id_not_ends_with?: string | null;

  nombre?: MesEnum | null;

  nombre_not?: MesEnum | null;

  nombre_in?: MesEnum[] | null;

  nombre_not_in?: MesEnum[] | null;

  habilitado?: boolean | null;

  habilitado_not?: boolean | null;

  AND?: MesWhereInput[] | null;

  OR?: MesWhereInput[] | null;

  NOT?: MesWhereInput[] | null;
}

export interface AnnoWhereInput {
  id?: string | null;

  id_not?: string | null;

  id_in?: string[] | null;

  id_not_in?: string[] | null;

  id_lt?: string | null;

  id_lte?: string | null;

  id_gt?: string | null;

  id_gte?: string | null;

  id_contains?: string | null;

  id_not_contains?: string | null;

  id_starts_with?: string | null;

  id_not_starts_with?: string | null;

  id_ends_with?: string | null;

  id_not_ends_with?: string | null;

  numero?: number | null;

  numero_not?: number | null;

  numero_in?: number[] | null;

  numero_not_in?: number[] | null;

  numero_lt?: number | null;

  numero_lte?: number | null;

  numero_gt?: number | null;

  numero_gte?: number | null;

  habilitado?: boolean | null;

  habilitado_not?: boolean | null;

  AND?: AnnoWhereInput[] | null;

  OR?: AnnoWhereInput[] | null;

  NOT?: AnnoWhereInput[] | null;
}

export interface FileWhereInput {
  id?: string | null;

  id_not?: string | null;

  id_in?: string[] | null;

  id_not_in?: string[] | null;

  id_lt?: string | null;

  id_lte?: string | null;

  id_gt?: string | null;

  id_gte?: string | null;

  id_contains?: string | null;

  id_not_contains?: string | null;

  id_starts_with?: string | null;

  id_not_starts_with?: string | null;

  id_ends_with?: string | null;

  id_not_ends_with?: string | null;

  path?: string | null;

  path_not?: string | null;

  path_in?: string[] | null;

  path_not_in?: string[] | null;

  path_lt?: string | null;

  path_lte?: string | null;

  path_gt?: string | null;

  path_gte?: string | null;

  path_contains?: string | null;

  path_not_contains?: string | null;

  path_starts_with?: string | null;

  path_not_starts_with?: string | null;

  path_ends_with?: string | null;

  path_not_ends_with?: string | null;

  filename?: string | null;

  filename_not?: string | null;

  filename_in?: string[] | null;

  filename_not_in?: string[] | null;

  filename_lt?: string | null;

  filename_lte?: string | null;

  filename_gt?: string | null;

  filename_gte?: string | null;

  filename_contains?: string | null;

  filename_not_contains?: string | null;

  filename_starts_with?: string | null;

  filename_not_starts_with?: string | null;

  filename_ends_with?: string | null;

  filename_not_ends_with?: string | null;

  mimetype?: string | null;

  mimetype_not?: string | null;

  mimetype_in?: string[] | null;

  mimetype_not_in?: string[] | null;

  mimetype_lt?: string | null;

  mimetype_lte?: string | null;

  mimetype_gt?: string | null;

  mimetype_gte?: string | null;

  mimetype_contains?: string | null;

  mimetype_not_contains?: string | null;

  mimetype_starts_with?: string | null;

  mimetype_not_starts_with?: string | null;

  mimetype_ends_with?: string | null;

  mimetype_not_ends_with?: string | null;

  encoding?: string | null;

  encoding_not?: string | null;

  encoding_in?: string[] | null;

  encoding_not_in?: string[] | null;

  encoding_lt?: string | null;

  encoding_lte?: string | null;

  encoding_gt?: string | null;

  encoding_gte?: string | null;

  encoding_contains?: string | null;

  encoding_not_contains?: string | null;

  encoding_starts_with?: string | null;

  encoding_not_starts_with?: string | null;

  encoding_ends_with?: string | null;

  encoding_not_ends_with?: string | null;

  size?: number | null;

  size_not?: number | null;

  size_in?: number[] | null;

  size_not_in?: number[] | null;

  size_lt?: number | null;

  size_lte?: number | null;

  size_gt?: number | null;

  size_gte?: number | null;

  AND?: FileWhereInput[] | null;

  OR?: FileWhereInput[] | null;

  NOT?: FileWhereInput[] | null;
}

export interface UserCreateInput {
  username: string;

  email: string;

  firstname: string;

  lastname: string;

  fullname: string;

  employeeNumber: string;

  roles?: RoleCreateManyWithoutUsersInput | null;

  integrantes?: IntegranteCreateManyWithoutUsuarioInput | null;
}

export interface RoleCreateManyWithoutUsersInput {
  create?: RoleCreateWithoutUsersInput[] | null;

  connect?: RoleWhereUniqueInput[] | null;
}

export interface RoleCreateWithoutUsersInput {
  name: string;

  description?: string | null;
}

export interface RoleWhereUniqueInput {
  id?: string | null;

  name?: string | null;
}

export interface IntegranteCreateManyWithoutUsuarioInput {
  create?: IntegranteCreateWithoutUsuarioInput[] | null;

  connect?: IntegranteWhereUniqueInput[] | null;
}

export interface IntegranteCreateWithoutUsuarioInput {
  proyecto: ProyectoCreateOneWithoutIntegrantesInput;

  jefeProyecto?: boolean | null;

  pagos?: PagoCreateManyWithoutIntegranteInput | null;
}

export interface ProyectoCreateOneWithoutIntegrantesInput {
  create?: ProyectoCreateWithoutIntegrantesInput | null;

  connect?: ProyectoWhereUniqueInput | null;
}

export interface ProyectoCreateWithoutIntegrantesInput {
  codigo: string;

  nombre: string;

  inicia: DateTime;

  finaliza: DateTime;

  area: AreaCreateOneInput;

  tipo: TipoCreateOneInput;

  linea: LineaCreateOneInput;

  eje: EjeCreateOneInput;

  alcance: AlcanceCreateOneInput;

  estado: Estado;
}

export interface AreaCreateOneInput {
  create?: AreaCreateInput | null;

  connect?: AreaWhereUniqueInput | null;
}

export interface AreaCreateInput {
  nombre: string;
}

export interface AreaWhereUniqueInput {
  id?: string | null;

  nombre?: string | null;
}

export interface TipoCreateOneInput {
  create?: TipoCreateInput | null;

  connect?: TipoWhereUniqueInput | null;
}

export interface TipoCreateInput {
  nombre: string;
}

export interface TipoWhereUniqueInput {
  id?: string | null;

  nombre?: string | null;
}

export interface LineaCreateOneInput {
  create?: LineaCreateInput | null;

  connect?: LineaWhereUniqueInput | null;
}

export interface LineaCreateInput {
  nombre: string;
}

export interface LineaWhereUniqueInput {
  id?: string | null;

  nombre?: string | null;
}

export interface EjeCreateOneInput {
  create?: EjeCreateInput | null;

  connect?: EjeWhereUniqueInput | null;
}

export interface EjeCreateInput {
  nombre: string;
}

export interface EjeWhereUniqueInput {
  id?: string | null;

  nombre?: string | null;
}

export interface AlcanceCreateOneInput {
  create?: AlcanceCreateInput | null;

  connect?: AlcanceWhereUniqueInput | null;
}

export interface AlcanceCreateInput {
  nombre: string;

  valor: number;
}

export interface AlcanceWhereUniqueInput {
  id?: string | null;

  nombre?: string | null;
}

export interface ProyectoWhereUniqueInput {
  id?: string | null;

  codigo?: string | null;

  nombre?: string | null;
}

export interface PagoCreateManyWithoutIntegranteInput {
  create?: PagoCreateWithoutIntegranteInput[] | null;

  connect?: PagoWhereUniqueInput[] | null;
}

export interface PagoCreateWithoutIntegranteInput {
  mes: MesCreateOneInput;

  anno: AnnoCreateOneInput;

  horas?: number | null;

  presencia?: number | null;

  incidencia?: number | null;

  relevancia?: number | null;

  complejidad?: number | null;

  gestion?: number | null;

  vinculacion?: number | null;

  calidad?: number | null;

  significacion?: number | null;

  cumplimiento?: number | null;

  calculo?: number | null;
}

export interface MesCreateOneInput {
  create?: MesCreateInput | null;

  connect?: MesWhereUniqueInput | null;
}

export interface MesCreateInput {
  nombre: MesEnum;

  habilitado?: boolean | null;
}

export interface MesWhereUniqueInput {
  id?: string | null;

  nombre?: MesEnum | null;
}

export interface AnnoCreateOneInput {
  create?: AnnoCreateInput | null;

  connect?: AnnoWhereUniqueInput | null;
}

export interface AnnoCreateInput {
  numero: number;

  habilitado?: boolean | null;
}

export interface AnnoWhereUniqueInput {
  id?: string | null;

  numero?: number | null;
}

export interface PagoWhereUniqueInput {
  id?: string | null;
}

export interface IntegranteWhereUniqueInput {
  id?: string | null;
}

export interface UserUpdateInput {
  username?: string | null;

  email?: string | null;

  firstname?: string | null;

  lastname?: string | null;

  fullname?: string | null;

  employeeNumber?: string | null;

  roles?: RoleUpdateManyWithoutUsersInput | null;

  integrantes?: IntegranteUpdateManyWithoutUsuarioInput | null;
}

export interface RoleUpdateManyWithoutUsersInput {
  create?: RoleCreateWithoutUsersInput[] | null;

  delete?: RoleWhereUniqueInput[] | null;

  connect?: RoleWhereUniqueInput[] | null;

  disconnect?: RoleWhereUniqueInput[] | null;

  update?: RoleUpdateWithWhereUniqueWithoutUsersInput[] | null;

  upsert?: RoleUpsertWithWhereUniqueWithoutUsersInput[] | null;
}

export interface RoleUpdateWithWhereUniqueWithoutUsersInput {
  where: RoleWhereUniqueInput;

  data: RoleUpdateWithoutUsersDataInput;
}

export interface RoleUpdateWithoutUsersDataInput {
  name?: string | null;

  description?: string | null;
}

export interface RoleUpsertWithWhereUniqueWithoutUsersInput {
  where: RoleWhereUniqueInput;

  update: RoleUpdateWithoutUsersDataInput;

  create: RoleCreateWithoutUsersInput;
}

export interface IntegranteUpdateManyWithoutUsuarioInput {
  create?: IntegranteCreateWithoutUsuarioInput[] | null;

  delete?: IntegranteWhereUniqueInput[] | null;

  connect?: IntegranteWhereUniqueInput[] | null;

  disconnect?: IntegranteWhereUniqueInput[] | null;

  update?: IntegranteUpdateWithWhereUniqueWithoutUsuarioInput[] | null;

  upsert?: IntegranteUpsertWithWhereUniqueWithoutUsuarioInput[] | null;
}

export interface IntegranteUpdateWithWhereUniqueWithoutUsuarioInput {
  where: IntegranteWhereUniqueInput;

  data: IntegranteUpdateWithoutUsuarioDataInput;
}

export interface IntegranteUpdateWithoutUsuarioDataInput {
  proyecto?: ProyectoUpdateOneRequiredWithoutIntegrantesInput | null;

  jefeProyecto?: boolean | null;

  pagos?: PagoUpdateManyWithoutIntegranteInput | null;
}

export interface ProyectoUpdateOneRequiredWithoutIntegrantesInput {
  create?: ProyectoCreateWithoutIntegrantesInput | null;

  update?: ProyectoUpdateWithoutIntegrantesDataInput | null;

  upsert?: ProyectoUpsertWithoutIntegrantesInput | null;

  connect?: ProyectoWhereUniqueInput | null;
}

export interface ProyectoUpdateWithoutIntegrantesDataInput {
  codigo?: string | null;

  nombre?: string | null;

  inicia?: DateTime | null;

  finaliza?: DateTime | null;

  area?: AreaUpdateOneRequiredInput | null;

  tipo?: TipoUpdateOneRequiredInput | null;

  linea?: LineaUpdateOneRequiredInput | null;

  eje?: EjeUpdateOneRequiredInput | null;

  alcance?: AlcanceUpdateOneRequiredInput | null;

  estado?: Estado | null;
}

export interface AreaUpdateOneRequiredInput {
  create?: AreaCreateInput | null;

  update?: AreaUpdateDataInput | null;

  upsert?: AreaUpsertNestedInput | null;

  connect?: AreaWhereUniqueInput | null;
}

export interface AreaUpdateDataInput {
  nombre?: string | null;
}

export interface AreaUpsertNestedInput {
  update: AreaUpdateDataInput;

  create: AreaCreateInput;
}

export interface TipoUpdateOneRequiredInput {
  create?: TipoCreateInput | null;

  update?: TipoUpdateDataInput | null;

  upsert?: TipoUpsertNestedInput | null;

  connect?: TipoWhereUniqueInput | null;
}

export interface TipoUpdateDataInput {
  nombre?: string | null;
}

export interface TipoUpsertNestedInput {
  update: TipoUpdateDataInput;

  create: TipoCreateInput;
}

export interface LineaUpdateOneRequiredInput {
  create?: LineaCreateInput | null;

  update?: LineaUpdateDataInput | null;

  upsert?: LineaUpsertNestedInput | null;

  connect?: LineaWhereUniqueInput | null;
}

export interface LineaUpdateDataInput {
  nombre?: string | null;
}

export interface LineaUpsertNestedInput {
  update: LineaUpdateDataInput;

  create: LineaCreateInput;
}

export interface EjeUpdateOneRequiredInput {
  create?: EjeCreateInput | null;

  update?: EjeUpdateDataInput | null;

  upsert?: EjeUpsertNestedInput | null;

  connect?: EjeWhereUniqueInput | null;
}

export interface EjeUpdateDataInput {
  nombre?: string | null;
}

export interface EjeUpsertNestedInput {
  update: EjeUpdateDataInput;

  create: EjeCreateInput;
}

export interface AlcanceUpdateOneRequiredInput {
  create?: AlcanceCreateInput | null;

  update?: AlcanceUpdateDataInput | null;

  upsert?: AlcanceUpsertNestedInput | null;

  connect?: AlcanceWhereUniqueInput | null;
}

export interface AlcanceUpdateDataInput {
  nombre?: string | null;

  valor?: number | null;
}

export interface AlcanceUpsertNestedInput {
  update: AlcanceUpdateDataInput;

  create: AlcanceCreateInput;
}

export interface ProyectoUpsertWithoutIntegrantesInput {
  update: ProyectoUpdateWithoutIntegrantesDataInput;

  create: ProyectoCreateWithoutIntegrantesInput;
}

export interface PagoUpdateManyWithoutIntegranteInput {
  create?: PagoCreateWithoutIntegranteInput[] | null;

  delete?: PagoWhereUniqueInput[] | null;

  connect?: PagoWhereUniqueInput[] | null;

  disconnect?: PagoWhereUniqueInput[] | null;

  update?: PagoUpdateWithWhereUniqueWithoutIntegranteInput[] | null;

  upsert?: PagoUpsertWithWhereUniqueWithoutIntegranteInput[] | null;
}

export interface PagoUpdateWithWhereUniqueWithoutIntegranteInput {
  where: PagoWhereUniqueInput;

  data: PagoUpdateWithoutIntegranteDataInput;
}

export interface PagoUpdateWithoutIntegranteDataInput {
  mes?: MesUpdateOneRequiredInput | null;

  anno?: AnnoUpdateOneRequiredInput | null;

  horas?: number | null;

  presencia?: number | null;

  incidencia?: number | null;

  relevancia?: number | null;

  complejidad?: number | null;

  gestion?: number | null;

  vinculacion?: number | null;

  calidad?: number | null;

  significacion?: number | null;

  cumplimiento?: number | null;

  calculo?: number | null;
}

export interface MesUpdateOneRequiredInput {
  create?: MesCreateInput | null;

  update?: MesUpdateDataInput | null;

  upsert?: MesUpsertNestedInput | null;

  connect?: MesWhereUniqueInput | null;
}

export interface MesUpdateDataInput {
  nombre?: MesEnum | null;

  habilitado?: boolean | null;
}

export interface MesUpsertNestedInput {
  update: MesUpdateDataInput;

  create: MesCreateInput;
}

export interface AnnoUpdateOneRequiredInput {
  create?: AnnoCreateInput | null;

  update?: AnnoUpdateDataInput | null;

  upsert?: AnnoUpsertNestedInput | null;

  connect?: AnnoWhereUniqueInput | null;
}

export interface AnnoUpdateDataInput {
  numero?: number | null;

  habilitado?: boolean | null;
}

export interface AnnoUpsertNestedInput {
  update: AnnoUpdateDataInput;

  create: AnnoCreateInput;
}

export interface PagoUpsertWithWhereUniqueWithoutIntegranteInput {
  where: PagoWhereUniqueInput;

  update: PagoUpdateWithoutIntegranteDataInput;

  create: PagoCreateWithoutIntegranteInput;
}

export interface IntegranteUpsertWithWhereUniqueWithoutUsuarioInput {
  where: IntegranteWhereUniqueInput;

  update: IntegranteUpdateWithoutUsuarioDataInput;

  create: IntegranteCreateWithoutUsuarioInput;
}

export interface UserWhereUniqueInput {
  id?: string | null;

  username?: string | null;

  email?: string | null;

  employeeNumber?: string | null;
}

export interface RoleCreateInput {
  name: string;

  description?: string | null;

  users?: UserCreateManyWithoutRolesInput | null;
}

export interface UserCreateManyWithoutRolesInput {
  create?: UserCreateWithoutRolesInput[] | null;

  connect?: UserWhereUniqueInput[] | null;
}

export interface UserCreateWithoutRolesInput {
  username: string;

  email: string;

  firstname: string;

  lastname: string;

  fullname: string;

  employeeNumber: string;

  integrantes?: IntegranteCreateManyWithoutUsuarioInput | null;
}

export interface RoleUpdateInput {
  name?: string | null;

  description?: string | null;

  users?: UserUpdateManyWithoutRolesInput | null;
}

export interface UserUpdateManyWithoutRolesInput {
  create?: UserCreateWithoutRolesInput[] | null;

  delete?: UserWhereUniqueInput[] | null;

  connect?: UserWhereUniqueInput[] | null;

  disconnect?: UserWhereUniqueInput[] | null;

  update?: UserUpdateWithWhereUniqueWithoutRolesInput[] | null;

  upsert?: UserUpsertWithWhereUniqueWithoutRolesInput[] | null;
}

export interface UserUpdateWithWhereUniqueWithoutRolesInput {
  where: UserWhereUniqueInput;

  data: UserUpdateWithoutRolesDataInput;
}

export interface UserUpdateWithoutRolesDataInput {
  username?: string | null;

  email?: string | null;

  firstname?: string | null;

  lastname?: string | null;

  fullname?: string | null;

  employeeNumber?: string | null;

  integrantes?: IntegranteUpdateManyWithoutUsuarioInput | null;
}

export interface UserUpsertWithWhereUniqueWithoutRolesInput {
  where: UserWhereUniqueInput;

  update: UserUpdateWithoutRolesDataInput;

  create: UserCreateWithoutRolesInput;
}

export interface ProyectoCreateInput {
  codigo: string;

  nombre: string;

  inicia: DateTime;

  finaliza: DateTime;

  area: AreaCreateOneInput;

  tipo: TipoCreateOneInput;

  linea: LineaCreateOneInput;

  eje: EjeCreateOneInput;

  alcance: AlcanceCreateOneInput;

  estado: Estado;

  integrantes?: IntegranteCreateManyWithoutProyectoInput | null;
}

export interface IntegranteCreateManyWithoutProyectoInput {
  create?: IntegranteCreateWithoutProyectoInput[] | null;

  connect?: IntegranteWhereUniqueInput[] | null;
}

export interface IntegranteCreateWithoutProyectoInput {
  usuario: UserCreateOneWithoutIntegrantesInput;

  jefeProyecto?: boolean | null;

  pagos?: PagoCreateManyWithoutIntegranteInput | null;
}

export interface UserCreateOneWithoutIntegrantesInput {
  create?: UserCreateWithoutIntegrantesInput | null;

  connect?: UserWhereUniqueInput | null;
}

export interface UserCreateWithoutIntegrantesInput {
  username: string;

  email: string;

  firstname: string;

  lastname: string;

  fullname: string;

  employeeNumber: string;

  roles?: RoleCreateManyWithoutUsersInput | null;
}

export interface ProyectoUpdateInput {
  codigo?: string | null;

  nombre?: string | null;

  inicia?: DateTime | null;

  finaliza?: DateTime | null;

  area?: AreaUpdateOneRequiredInput | null;

  tipo?: TipoUpdateOneRequiredInput | null;

  linea?: LineaUpdateOneRequiredInput | null;

  eje?: EjeUpdateOneRequiredInput | null;

  alcance?: AlcanceUpdateOneRequiredInput | null;

  estado?: Estado | null;

  integrantes?: IntegranteUpdateManyWithoutProyectoInput | null;
}

export interface IntegranteUpdateManyWithoutProyectoInput {
  create?: IntegranteCreateWithoutProyectoInput[] | null;

  delete?: IntegranteWhereUniqueInput[] | null;

  connect?: IntegranteWhereUniqueInput[] | null;

  disconnect?: IntegranteWhereUniqueInput[] | null;

  update?: IntegranteUpdateWithWhereUniqueWithoutProyectoInput[] | null;

  upsert?: IntegranteUpsertWithWhereUniqueWithoutProyectoInput[] | null;
}

export interface IntegranteUpdateWithWhereUniqueWithoutProyectoInput {
  where: IntegranteWhereUniqueInput;

  data: IntegranteUpdateWithoutProyectoDataInput;
}

export interface IntegranteUpdateWithoutProyectoDataInput {
  usuario?: UserUpdateOneRequiredWithoutIntegrantesInput | null;

  jefeProyecto?: boolean | null;

  pagos?: PagoUpdateManyWithoutIntegranteInput | null;
}

export interface UserUpdateOneRequiredWithoutIntegrantesInput {
  create?: UserCreateWithoutIntegrantesInput | null;

  update?: UserUpdateWithoutIntegrantesDataInput | null;

  upsert?: UserUpsertWithoutIntegrantesInput | null;

  connect?: UserWhereUniqueInput | null;
}

export interface UserUpdateWithoutIntegrantesDataInput {
  username?: string | null;

  email?: string | null;

  firstname?: string | null;

  lastname?: string | null;

  fullname?: string | null;

  employeeNumber?: string | null;

  roles?: RoleUpdateManyWithoutUsersInput | null;
}

export interface UserUpsertWithoutIntegrantesInput {
  update: UserUpdateWithoutIntegrantesDataInput;

  create: UserCreateWithoutIntegrantesInput;
}

export interface IntegranteUpsertWithWhereUniqueWithoutProyectoInput {
  where: IntegranteWhereUniqueInput;

  update: IntegranteUpdateWithoutProyectoDataInput;

  create: IntegranteCreateWithoutProyectoInput;
}

export interface IntegranteCreateInput {
  usuario: UserCreateOneWithoutIntegrantesInput;

  proyecto: ProyectoCreateOneWithoutIntegrantesInput;

  jefeProyecto?: boolean | null;

  pagos?: PagoCreateManyWithoutIntegranteInput | null;
}

export interface IntegranteUpdateInput {
  usuario?: UserUpdateOneRequiredWithoutIntegrantesInput | null;

  proyecto?: ProyectoUpdateOneRequiredWithoutIntegrantesInput | null;

  jefeProyecto?: boolean | null;

  pagos?: PagoUpdateManyWithoutIntegranteInput | null;
}

export interface PagoCreateInput {
  integrante: IntegranteCreateOneWithoutPagosInput;

  mes: MesCreateOneInput;

  anno: AnnoCreateOneInput;

  horas?: number | null;

  presencia?: number | null;

  incidencia?: number | null;

  relevancia?: number | null;

  complejidad?: number | null;

  gestion?: number | null;

  vinculacion?: number | null;

  calidad?: number | null;

  significacion?: number | null;

  cumplimiento?: number | null;

  calculo?: number | null;
}

export interface IntegranteCreateOneWithoutPagosInput {
  create?: IntegranteCreateWithoutPagosInput | null;

  connect?: IntegranteWhereUniqueInput | null;
}

export interface IntegranteCreateWithoutPagosInput {
  usuario: UserCreateOneWithoutIntegrantesInput;

  proyecto: ProyectoCreateOneWithoutIntegrantesInput;

  jefeProyecto?: boolean | null;
}

export interface PagoUpdateInput {
  integrante?: IntegranteUpdateOneRequiredWithoutPagosInput | null;

  mes?: MesUpdateOneRequiredInput | null;

  anno?: AnnoUpdateOneRequiredInput | null;

  horas?: number | null;

  presencia?: number | null;

  incidencia?: number | null;

  relevancia?: number | null;

  complejidad?: number | null;

  gestion?: number | null;

  vinculacion?: number | null;

  calidad?: number | null;

  significacion?: number | null;

  cumplimiento?: number | null;

  calculo?: number | null;
}

export interface IntegranteUpdateOneRequiredWithoutPagosInput {
  create?: IntegranteCreateWithoutPagosInput | null;

  update?: IntegranteUpdateWithoutPagosDataInput | null;

  upsert?: IntegranteUpsertWithoutPagosInput | null;

  connect?: IntegranteWhereUniqueInput | null;
}

export interface IntegranteUpdateWithoutPagosDataInput {
  usuario?: UserUpdateOneRequiredWithoutIntegrantesInput | null;

  proyecto?: ProyectoUpdateOneRequiredWithoutIntegrantesInput | null;

  jefeProyecto?: boolean | null;
}

export interface IntegranteUpsertWithoutPagosInput {
  update: IntegranteUpdateWithoutPagosDataInput;

  create: IntegranteCreateWithoutPagosInput;
}

export interface TipoUpdateInput {
  nombre?: string | null;
}

export interface EjeUpdateInput {
  nombre?: string | null;
}

export interface LineaUpdateInput {
  nombre?: string | null;
}

export interface AlcanceUpdateInput {
  nombre?: string | null;

  valor?: number | null;
}

export interface AreaUpdateInput {
  nombre?: string | null;
}

export interface AnnoUpdateInput {
  numero?: number | null;

  habilitado?: boolean | null;
}

export interface MesUpdateInput {
  nombre?: MesEnum | null;

  habilitado?: boolean | null;
}

export interface FileWhereUniqueInput {
  id?: string | null;
}

export enum Estado {
  Creado = "CREADO",
  Habilitado = "HABILITADO",
  Cerrado = "CERRADO"
}

export enum MesEnum {
  Enero = "ENERO",
  Febrero = "FEBRERO",
  Marzo = "MARZO",
  Abril = "ABRIL",
  Mayo = "MAYO",
  Junio = "JUNIO",
  Julio = "JULIO",
  Agosto = "AGOSTO",
  Septiembre = "SEPTIEMBRE",
  Octubre = "OCTUBRE",
  Noviembre = "NOVIEMBRE",
  Diciembre = "DICIEMBRE"
}

export enum RoleOrderByInput {
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  NameAsc = "name_ASC",
  NameDesc = "name_DESC",
  DescriptionAsc = "description_ASC",
  DescriptionDesc = "description_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC"
}

export enum UserOrderByInput {
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  UsernameAsc = "username_ASC",
  UsernameDesc = "username_DESC",
  EmailAsc = "email_ASC",
  EmailDesc = "email_DESC",
  FirstnameAsc = "firstname_ASC",
  FirstnameDesc = "firstname_DESC",
  LastnameAsc = "lastname_ASC",
  LastnameDesc = "lastname_DESC",
  FullnameAsc = "fullname_ASC",
  FullnameDesc = "fullname_DESC",
  EmployeeNumberAsc = "employeeNumber_ASC",
  EmployeeNumberDesc = "employeeNumber_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC"
}

export enum IntegranteOrderByInput {
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  JefeProyectoAsc = "jefeProyecto_ASC",
  JefeProyectoDesc = "jefeProyecto_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC"
}

export enum PagoOrderByInput {
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  HorasAsc = "horas_ASC",
  HorasDesc = "horas_DESC",
  PresenciaAsc = "presencia_ASC",
  PresenciaDesc = "presencia_DESC",
  IncidenciaAsc = "incidencia_ASC",
  IncidenciaDesc = "incidencia_DESC",
  RelevanciaAsc = "relevancia_ASC",
  RelevanciaDesc = "relevancia_DESC",
  ComplejidadAsc = "complejidad_ASC",
  ComplejidadDesc = "complejidad_DESC",
  GestionAsc = "gestion_ASC",
  GestionDesc = "gestion_DESC",
  VinculacionAsc = "vinculacion_ASC",
  VinculacionDesc = "vinculacion_DESC",
  CalidadAsc = "calidad_ASC",
  CalidadDesc = "calidad_DESC",
  SignificacionAsc = "significacion_ASC",
  SignificacionDesc = "significacion_DESC",
  CumplimientoAsc = "cumplimiento_ASC",
  CumplimientoDesc = "cumplimiento_DESC",
  CalculoAsc = "calculo_ASC",
  CalculoDesc = "calculo_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC"
}

export enum FileOrderByInput {
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  PathAsc = "path_ASC",
  PathDesc = "path_DESC",
  FilenameAsc = "filename_ASC",
  FilenameDesc = "filename_DESC",
  MimetypeAsc = "mimetype_ASC",
  MimetypeDesc = "mimetype_DESC",
  EncodingAsc = "encoding_ASC",
  EncodingDesc = "encoding_DESC",
  SizeAsc = "size_ASC",
  SizeDesc = "size_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC"
}

export enum ProyectoOrderByInput {
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  CodigoAsc = "codigo_ASC",
  CodigoDesc = "codigo_DESC",
  NombreAsc = "nombre_ASC",
  NombreDesc = "nombre_DESC",
  IniciaAsc = "inicia_ASC",
  IniciaDesc = "inicia_DESC",
  FinalizaAsc = "finaliza_ASC",
  FinalizaDesc = "finaliza_DESC",
  EstadoAsc = "estado_ASC",
  EstadoDesc = "estado_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC"
}

export enum TipoOrderByInput {
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  NombreAsc = "nombre_ASC",
  NombreDesc = "nombre_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC"
}

export enum EjeOrderByInput {
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  NombreAsc = "nombre_ASC",
  NombreDesc = "nombre_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC"
}

export enum LineaOrderByInput {
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  NombreAsc = "nombre_ASC",
  NombreDesc = "nombre_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC"
}

export enum AlcanceOrderByInput {
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  NombreAsc = "nombre_ASC",
  NombreDesc = "nombre_DESC",
  ValorAsc = "valor_ASC",
  ValorDesc = "valor_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC"
}

export enum AreaOrderByInput {
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  NombreAsc = "nombre_ASC",
  NombreDesc = "nombre_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC"
}

export enum AnnoOrderByInput {
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  NumeroAsc = "numero_ASC",
  NumeroDesc = "numero_DESC",
  HabilitadoAsc = "habilitado_ASC",
  HabilitadoDesc = "habilitado_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC"
}

export enum MesOrderByInput {
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  NombreAsc = "nombre_ASC",
  NombreDesc = "nombre_DESC",
  HabilitadoAsc = "habilitado_ASC",
  HabilitadoDesc = "habilitado_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC"
}

export enum MutationType {
  Created = "CREATED",
  Updated = "UPDATED",
  Deleted = "DELETED"
}

export type DateTime = any;

export type Long = any;

export type Upload = any;

/** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
export type Json = any;

/** Date custom scalar type */
export type Date = any;

// ====================================================
// Documents
// ====================================================

export namespace CreateArea {
  export type Variables = {
    data: AreaCreateInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    createArea: CreateArea;
  };

  export type CreateArea = {
    __typename?: "Area";

    id: string;

    nombre: string;
  };
}

export namespace DeleteArea {
  export type Variables = {
    where: AreaWhereUniqueInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    deleteArea: DeleteArea | null;
  };

  export type DeleteArea = {
    __typename?: "Area";

    nombre: string;
  };
}

export namespace DeleteManyAreas {
  export type Variables = {
    where: AreaWhereInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    deleteManyAreas: DeleteManyAreas;
  };

  export type DeleteManyAreas = {
    __typename?: "BatchPayload";

    count: Long;
  };
}

export namespace UpdateArea {
  export type Variables = {
    data: AreaUpdateInput;
    where: AreaWhereUniqueInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    updateArea: UpdateArea | null;
  };

  export type UpdateArea = {
    __typename?: "Area";

    id: string;

    nombre: string;
  };
}

export namespace CreateTipo {
  export type Variables = {
    data: TipoCreateInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    createTipo: CreateTipo;
  };

  export type CreateTipo = {
    __typename?: "Tipo";

    id: string;

    nombre: string;
  };
}

export namespace DeleteTipo {
  export type Variables = {
    where: TipoWhereUniqueInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    deleteTipo: DeleteTipo | null;
  };

  export type DeleteTipo = {
    __typename?: "Tipo";

    nombre: string;
  };
}

export namespace UpdateTipo {
  export type Variables = {
    data: TipoUpdateInput;
    where: TipoWhereUniqueInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    updateTipo: UpdateTipo | null;
  };

  export type UpdateTipo = {
    __typename?: "Tipo";

    id: string;

    nombre: string;
  };
}

export namespace DeleteProyecto {
  export type Variables = {
    where: ProyectoWhereUniqueInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    deleteProyecto: DeleteProyecto | null;
  };

  export type DeleteProyecto = {
    __typename?: "Proyecto";

    id: string;
  };
}

export namespace DeleteManyProyectos {
  export type Variables = {
    where: ProyectoWhereInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    deleteManyProyectos: DeleteManyProyectos;
  };

  export type DeleteManyProyectos = {
    __typename?: "BatchPayload";

    count: Long;
  };
}

export namespace Login {
  export type Variables = {
    username: string;
    password: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    login: Login;
  };

  export type Login = {
    __typename?: "AuthPayload";

    user: User;

    token: string;
  };

  export type User = {
    __typename?: "User";

    firstname: string;

    username: string;

    roles: Roles[] | null;
  };

  export type Roles = {
    __typename?: "Role";

    name: string;
  };
}

export namespace ChangeFile {
  export type Variables = {
    file: Upload;
    where: FileWhereUniqueInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    changeFile: ChangeFile | null;
  };

  export type ChangeFile = {
    __typename?: "File";

    filename: string;
  };
}

export namespace DeleteFile {
  export type Variables = {
    where: FileWhereUniqueInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    deleteFile: DeleteFile | null;
  };

  export type DeleteFile = {
    __typename?: "File";

    filename: string;
  };
}

export namespace DeleteManyFiles {
  export type Variables = {
    where: FileWhereInput;
  };

  export type Mutation = {
    __typename?: "Mutation";

    deleteManyFiles: DeleteManyFiles;
  };

  export type DeleteManyFiles = {
    __typename?: "BatchPayload";

    count: Long;
  };
}

export namespace UploadFiles {
  export type Variables = {
    files: Upload[];
  };

  export type Mutation = {
    __typename?: "Mutation";

    uploadFiles: UploadFiles[];
  };

  export type UploadFiles = {
    __typename?: "File";

    filename: string;
  };
}

export namespace Pagos {
  export type Variables = {
    where?: PagoWhereInput | null;
    orderBy?: PagoOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
  };

  export type Query = {
    __typename?: "Query";

    pagos: Pagos[];
  };

  export type Pagos = {
    __typename?: "Pago";

    id: string;

    integrante: Integrante;

    mes: Mes;

    anno: Anno;

    horas: number;

    presencia: number;

    incidencia: number;

    relevancia: number;

    complejidad: number;

    gestion: number;

    vinculacion: number;

    calidad: number;

    significacion: number;

    cumplimiento: number;

    calculo: number;
  };

  export type Integrante = {
    __typename?: "Integrante";

    id: string;

    usuario: Usuario;
  };

  export type Usuario = {
    __typename?: "User";

    id: string;

    fullname: string;

    employeeNumber: string;
  };

  export type Mes = {
    __typename?: "Mes";

    id: string;

    nombre: MesEnum;
  };

  export type Anno = {
    __typename?: "Anno";

    id: string;

    numero: number;
  };
}

export namespace ExistUser {
  export type Variables = {
    where?: UserWhereInput | null;
  };

  export type Query = {
    __typename?: "Query";

    existUser: boolean;
  };
}

export namespace Pago {
  export type Variables = {
    id: string;
  };

  export type Query = {
    __typename?: "Query";

    pago: Pago;
  };

  export type Pago = {
    __typename?: "Pago";

    id: string;

    integrante: Integrante;

    mes: Mes;

    anno: Anno;

    horas: number;

    presencia: number;

    incidencia: number;

    relevancia: number;

    complejidad: number;

    gestion: number;

    vinculacion: number;

    calidad: number;

    significacion: number;

    cumplimiento: number;

    calculo: number;
  };

  export type Integrante = {
    __typename?: "Integrante";

    id: string;

    usuario: Usuario;
  };

  export type Usuario = {
    __typename?: "User";

    id: string;

    fullname: string;

    employeeNumber: string;
  };

  export type Mes = {
    __typename?: "Mes";

    id: string;

    nombre: MesEnum;
  };

  export type Anno = {
    __typename?: "Anno";

    id: string;

    numero: number;
  };
}

export namespace Integrantes {
  export type Variables = {
    where?: IntegranteWhereInput | null;
    orderBy?: IntegranteOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
  };

  export type Query = {
    __typename?: "Query";

    integrantes: Integrantes[];
  };

  export type Integrantes = {
    __typename?: "Integrante";

    id: string;

    proyecto: Proyecto;

    usuario: Usuario;

    jefeProyecto: boolean;

    pagos: Pagos[] | null;
  };

  export type Proyecto = {
    __typename?: "Proyecto";

    id: string;

    codigo: string;
  };

  export type Usuario = {
    __typename?: "User";

    id: string;

    firstname: string;

    lastname: string;

    fullname: string;

    email: string;

    username: string;

    employeeNumber: string;

    roles: Roles[] | null;
  };

  export type Roles = {
    __typename?: "Role";

    id: string;

    name: string;
  };

  export type Pagos = {
    __typename?: "Pago";

    id: string;

    integrante: Integrante;

    mes: Mes;

    anno: Anno;

    horas: number;

    presencia: number;

    incidencia: number;

    relevancia: number;

    complejidad: number;

    gestion: number;

    vinculacion: number;

    calidad: number;

    significacion: number;

    cumplimiento: number;

    calculo: number;
  };

  export type Integrante = {
    __typename?: "Integrante";

    id: string;

    usuario: _Usuario;
  };

  export type _Usuario = {
    __typename?: "User";

    id: string;

    fullname: string;

    employeeNumber: string;
  };

  export type Mes = {
    __typename?: "Mes";

    id: string;

    nombre: MesEnum;
  };

  export type Anno = {
    __typename?: "Anno";

    id: string;

    numero: number;
  };
}

export namespace Integrante {
  export type Variables = {
    id: string;
  };

  export type Query = {
    __typename?: "Query";

    integrante: Integrante;
  };

  export type Integrante = {
    __typename?: "Integrante";

    id: string;

    proyecto: Proyecto;

    usuario: Usuario;

    jefeProyecto: boolean;

    pagos: Pagos[] | null;
  };

  export type Proyecto = {
    __typename?: "Proyecto";

    id: string;

    codigo: string;
  };

  export type Usuario = {
    __typename?: "User";

    id: string;

    firstname: string;

    lastname: string;

    fullname: string;

    email: string;

    username: string;

    employeeNumber: string;

    roles: Roles[] | null;
  };

  export type Roles = {
    __typename?: "Role";

    id: string;

    name: string;
  };

  export type Pagos = {
    __typename?: "Pago";

    id: string;

    integrante: _Integrante;

    mes: Mes;

    anno: Anno;

    horas: number;

    presencia: number;

    incidencia: number;

    relevancia: number;

    complejidad: number;

    gestion: number;

    vinculacion: number;

    calidad: number;

    significacion: number;

    cumplimiento: number;

    calculo: number;
  };

  export type _Integrante = {
    __typename?: "Integrante";

    id: string;

    usuario: _Usuario;
  };

  export type _Usuario = {
    __typename?: "User";

    id: string;

    fullname: string;

    employeeNumber: string;
  };

  export type Mes = {
    __typename?: "Mes";

    id: string;

    nombre: MesEnum;
  };

  export type Anno = {
    __typename?: "Anno";

    id: string;

    numero: number;
  };
}

export namespace Annos {
  export type Variables = {
    where?: AnnoWhereInput | null;
    orderBy?: AnnoOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
  };

  export type Query = {
    __typename?: "Query";

    annos: Annos[];
  };

  export type Annos = {
    __typename?: "Anno";

    id: string;

    numero: number;

    habilitado: boolean;
  };
}

export namespace Meses {
  export type Variables = {
    where?: MesWhereInput | null;
    orderBy?: MesOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
  };

  export type Query = {
    __typename?: "Query";

    meses: Meses[];
  };

  export type Meses = {
    __typename?: "Mes";

    id: string;

    nombre: MesEnum;

    habilitado: boolean;
  };
}

export namespace Alcance {
  export type Variables = {
    id: string;
  };

  export type Query = {
    __typename?: "Query";

    alcance: Alcance;
  };

  export type Alcance = {
    __typename?: "Alcance";

    id: string;

    nombre: string;

    valor: number;
  };
}

export namespace Alcances {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    alcances: Alcances[];
  };

  export type Alcances = {
    __typename?: "Alcance";

    id: string;

    nombre: string;

    valor: number;
  };
}

export namespace Area {
  export type Variables = {
    id: string;
  };

  export type Query = {
    __typename?: "Query";

    area: Area;
  };

  export type Area = {
    __typename?: "Area";

    id: string;

    nombre: string;
  };
}

export namespace Areas {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    areas: Areas[];
  };

  export type Areas = {
    __typename?: "Area";

    id: string;

    nombre: string;
  };
}

export namespace Eje {
  export type Variables = {
    id: string;
  };

  export type Query = {
    __typename?: "Query";

    eje: Eje;
  };

  export type Eje = {
    __typename?: "Eje";

    id: string;

    nombre: string;
  };
}

export namespace Ejes {
  export type Variables = {
    where?: EjeWhereInput | null;
    orderBy?: EjeOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
  };

  export type Query = {
    __typename?: "Query";

    ejes: Ejes[];
  };

  export type Ejes = {
    __typename?: "Eje";

    id: string;

    nombre: string;
  };
}

export namespace Linea {
  export type Variables = {
    id: string;
  };

  export type Query = {
    __typename?: "Query";

    linea: Linea;
  };

  export type Linea = {
    __typename?: "Linea";

    id: string;

    nombre: string;
  };
}

export namespace Lineas {
  export type Variables = {
    where?: LineaWhereInput | null;
    orderBy?: LineaOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
  };

  export type Query = {
    __typename?: "Query";

    lineas: Lineas[];
  };

  export type Lineas = {
    __typename?: "Linea";

    id: string;

    nombre: string;
  };
}

export namespace Tipo {
  export type Variables = {
    id: string;
  };

  export type Query = {
    __typename?: "Query";

    tipo: Tipo;
  };

  export type Tipo = {
    __typename?: "Tipo";

    id: string;

    nombre: string;
  };
}

export namespace Tipos {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    tipos: Tipos[];
  };

  export type Tipos = {
    __typename?: "Tipo";

    id: string;

    nombre: string;
  };
}

export namespace Proyecto {
  export type Variables = {
    id: string;
  };

  export type Query = {
    __typename?: "Query";

    proyecto: Proyecto;
  };

  export type Proyecto = {
    __typename?: "Proyecto";

    id: string;

    codigo: string;

    nombre: string;

    inicia: DateTime;

    finaliza: DateTime;

    area: Area;

    eje: Eje;

    linea: Linea;

    tipo: Tipo;

    alcance: Alcance;

    estado: Estado;

    integrantes: Integrantes[] | null;
  };

  export type Area = {
    __typename?: "Area";

    id: string;

    nombre: string;
  };

  export type Eje = {
    __typename?: "Eje";

    id: string;

    nombre: string;
  };

  export type Linea = {
    __typename?: "Linea";

    id: string;

    nombre: string;
  };

  export type Tipo = {
    __typename?: "Tipo";

    id: string;

    nombre: string;
  };

  export type Alcance = {
    __typename?: "Alcance";

    id: string;

    nombre: string;

    valor: number;
  };

  export type Integrantes = {
    __typename?: "Integrante";

    id: string;

    proyecto: _Proyecto;

    usuario: Usuario;

    jefeProyecto: boolean;

    pagos: Pagos[] | null;
  };

  export type _Proyecto = {
    __typename?: "Proyecto";

    id: string;

    codigo: string;
  };

  export type Usuario = {
    __typename?: "User";

    id: string;

    firstname: string;

    lastname: string;

    fullname: string;

    email: string;

    username: string;

    employeeNumber: string;

    roles: Roles[] | null;
  };

  export type Roles = {
    __typename?: "Role";

    id: string;

    name: string;
  };

  export type Pagos = {
    __typename?: "Pago";

    id: string;

    integrante: Integrante;

    mes: Mes;

    anno: Anno;

    horas: number;

    presencia: number;

    incidencia: number;

    relevancia: number;

    complejidad: number;

    gestion: number;

    vinculacion: number;

    calidad: number;

    significacion: number;

    cumplimiento: number;

    calculo: number;
  };

  export type Integrante = {
    __typename?: "Integrante";

    id: string;

    usuario: _Usuario;
  };

  export type _Usuario = {
    __typename?: "User";

    id: string;

    fullname: string;

    employeeNumber: string;
  };

  export type Mes = {
    __typename?: "Mes";

    id: string;

    nombre: MesEnum;
  };

  export type Anno = {
    __typename?: "Anno";

    id: string;

    numero: number;
  };
}

export namespace Proyectos {
  export type Variables = {
    where?: ProyectoWhereInput | null;
    orderBy?: ProyectoOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
  };

  export type Query = {
    __typename?: "Query";

    proyectos: Proyectos[];
  };

  export type Proyectos = {
    __typename?: "Proyecto";

    id: string;

    codigo: string;

    nombre: string;

    inicia: DateTime;

    finaliza: DateTime;

    alcance: Alcance;

    area: Area;

    eje: Eje;

    linea: Linea;

    tipo: Tipo;

    estado: Estado;

    integrantes: Integrantes[] | null;
  };

  export type Alcance = {
    __typename?: "Alcance";

    id: string;

    nombre: string;

    valor: number;
  };

  export type Area = {
    __typename?: "Area";

    id: string;

    nombre: string;
  };

  export type Eje = {
    __typename?: "Eje";

    id: string;

    nombre: string;
  };

  export type Linea = {
    __typename?: "Linea";

    id: string;

    nombre: string;
  };

  export type Tipo = {
    __typename?: "Tipo";

    id: string;

    nombre: string;
  };

  export type Integrantes = {
    __typename?: "Integrante";

    id: string;

    proyecto: Proyecto;

    usuario: Usuario;

    jefeProyecto: boolean;

    pagos: Pagos[] | null;
  };

  export type Proyecto = {
    __typename?: "Proyecto";

    id: string;

    codigo: string;
  };

  export type Usuario = {
    __typename?: "User";

    id: string;

    firstname: string;

    lastname: string;

    fullname: string;

    email: string;

    username: string;

    employeeNumber: string;

    roles: Roles[] | null;
  };

  export type Roles = {
    __typename?: "Role";

    id: string;

    name: string;
  };

  export type Pagos = {
    __typename?: "Pago";

    id: string;

    integrante: Integrante;

    mes: Mes;

    anno: Anno;

    horas: number;

    presencia: number;

    incidencia: number;

    relevancia: number;

    complejidad: number;

    gestion: number;

    vinculacion: number;

    calidad: number;

    significacion: number;

    cumplimiento: number;

    calculo: number;
  };

  export type Integrante = {
    __typename?: "Integrante";

    id: string;

    usuario: _Usuario;
  };

  export type _Usuario = {
    __typename?: "User";

    id: string;

    fullname: string;

    employeeNumber: string;
  };

  export type Mes = {
    __typename?: "Mes";

    id: string;

    nombre: MesEnum;
  };

  export type Anno = {
    __typename?: "Anno";

    id: string;

    numero: number;
  };
}

export namespace Me {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    me: Me;
  };

  export type Me = {
    __typename?: "User";

    id: string;

    firstname: string;

    lastname: string;

    fullname: string;

    email: string;

    username: string;

    employeeNumber: string;

    roles: Roles[] | null;
  };

  export type Roles = {
    __typename?: "Role";

    id: string;

    name: string;
  };
}

export namespace Users {
  export type Variables = {
    where?: UserWhereInput | null;
    orderBy?: UserOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
  };

  export type Query = {
    __typename?: "Query";

    users: Users[];
  };

  export type Users = {
    __typename?: "User";

    id: string;

    firstname: string;

    lastname: string;

    fullname: string;

    email: string;

    username: string;

    employeeNumber: string;

    roles: Roles[] | null;
  };

  export type Roles = {
    __typename?: "Role";

    id: string;

    name: string;
  };
}

export namespace File {
  export type Variables = {
    id: string;
  };

  export type Query = {
    __typename?: "Query";

    file: File;
  };

  export type File = {
    __typename?: "File";

    id: string;

    filename: string;

    path: string;

    encoding: string;

    mimetype: string;

    size: number;
  };
}

export namespace Files {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    files: Files[];
  };

  export type Files = {
    __typename?: "File";

    id: string;

    filename: string;

    mimetype: string;

    path: string;

    size: number;
  };
}

// ====================================================
// START: Apollo Angular template
// ====================================================

import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";

import gql from "graphql-tag";

// ====================================================
// Apollo Services
// ====================================================

@Injectable({
  providedIn: "root"
})
export class CreateAreaGQL extends Apollo.Mutation<
  CreateArea.Mutation,
  CreateArea.Variables
> {
  document: any = gql`
    mutation createArea($data: AreaCreateInput!) {
      createArea(data: $data) {
        id
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class DeleteAreaGQL extends Apollo.Mutation<
  DeleteArea.Mutation,
  DeleteArea.Variables
> {
  document: any = gql`
    mutation deleteArea($where: AreaWhereUniqueInput!) {
      deleteArea(where: $where) {
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class DeleteManyAreasGQL extends Apollo.Mutation<
  DeleteManyAreas.Mutation,
  DeleteManyAreas.Variables
> {
  document: any = gql`
    mutation deleteManyAreas($where: AreaWhereInput!) {
      deleteManyAreas(where: $where) {
        count
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class UpdateAreaGQL extends Apollo.Mutation<
  UpdateArea.Mutation,
  UpdateArea.Variables
> {
  document: any = gql`
    mutation updateArea(
      $data: AreaUpdateInput!
      $where: AreaWhereUniqueInput!
    ) {
      updateArea(data: $data, where: $where) {
        id
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class CreateTipoGQL extends Apollo.Mutation<
  CreateTipo.Mutation,
  CreateTipo.Variables
> {
  document: any = gql`
    mutation createTipo($data: TipoCreateInput!) {
      createTipo(data: $data) {
        id
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class DeleteTipoGQL extends Apollo.Mutation<
  DeleteTipo.Mutation,
  DeleteTipo.Variables
> {
  document: any = gql`
    mutation deleteTipo($where: TipoWhereUniqueInput!) {
      deleteTipo(where: $where) {
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class UpdateTipoGQL extends Apollo.Mutation<
  UpdateTipo.Mutation,
  UpdateTipo.Variables
> {
  document: any = gql`
    mutation updateTipo(
      $data: TipoUpdateInput!
      $where: TipoWhereUniqueInput!
    ) {
      updateTipo(data: $data, where: $where) {
        id
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class DeleteProyectoGQL extends Apollo.Mutation<
  DeleteProyecto.Mutation,
  DeleteProyecto.Variables
> {
  document: any = gql`
    mutation deleteProyecto($where: ProyectoWhereUniqueInput!) {
      deleteProyecto(where: $where) {
        id
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class DeleteManyProyectosGQL extends Apollo.Mutation<
  DeleteManyProyectos.Mutation,
  DeleteManyProyectos.Variables
> {
  document: any = gql`
    mutation deleteManyProyectos($where: ProyectoWhereInput!) {
      deleteManyProyectos(where: $where) {
        count
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class LoginGQL extends Apollo.Mutation<Login.Mutation, Login.Variables> {
  document: any = gql`
    mutation login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        user {
          firstname
          username
          roles {
            name
          }
        }
        token
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class ChangeFileGQL extends Apollo.Mutation<
  ChangeFile.Mutation,
  ChangeFile.Variables
> {
  document: any = gql`
    mutation changeFile($file: Upload!, $where: FileWhereUniqueInput!) {
      changeFile(file: $file, where: $where) {
        filename
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class DeleteFileGQL extends Apollo.Mutation<
  DeleteFile.Mutation,
  DeleteFile.Variables
> {
  document: any = gql`
    mutation deleteFile($where: FileWhereUniqueInput!) {
      deleteFile(where: $where) {
        filename
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class DeleteManyFilesGQL extends Apollo.Mutation<
  DeleteManyFiles.Mutation,
  DeleteManyFiles.Variables
> {
  document: any = gql`
    mutation deleteManyFiles($where: FileWhereInput!) {
      deleteManyFiles(where: $where) {
        count
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class UploadFilesGQL extends Apollo.Mutation<
  UploadFiles.Mutation,
  UploadFiles.Variables
> {
  document: any = gql`
    mutation uploadFiles($files: [Upload!]!) {
      uploadFiles(files: $files) {
        filename
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class PagosGQL extends Apollo.Query<Pagos.Query, Pagos.Variables> {
  document: any = gql`
    query pagos(
      $where: PagoWhereInput
      $orderBy: PagoOrderByInput
      $skip: Int
      $after: String
      $before: String
      $first: Int
      $last: Int
    ) {
      pagos(
        where: $where
        orderBy: $orderBy
        skip: $skip
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        id
        integrante {
          id
          usuario {
            id
            fullname
            employeeNumber
          }
        }
        mes {
          id
          nombre
        }
        anno {
          id
          numero
        }
        horas
        presencia
        incidencia
        relevancia
        complejidad
        gestion
        vinculacion
        calidad
        significacion
        cumplimiento
        calculo
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class ExistUserGQL extends Apollo.Query<
  ExistUser.Query,
  ExistUser.Variables
> {
  document: any = gql`
    query existUser($where: UserWhereInput) {
      existUser(where: $where)
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class PagoGQL extends Apollo.Query<Pago.Query, Pago.Variables> {
  document: any = gql`
    query pago($id: String!) {
      pago(id: $id) {
        id
        integrante {
          id
          usuario {
            id
            fullname
            employeeNumber
          }
        }
        mes {
          id
          nombre
        }
        anno {
          id
          numero
        }
        horas
        presencia
        incidencia
        relevancia
        complejidad
        gestion
        vinculacion
        calidad
        significacion
        cumplimiento
        calculo
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class IntegrantesGQL extends Apollo.Query<
  Integrantes.Query,
  Integrantes.Variables
> {
  document: any = gql`
    query integrantes(
      $where: IntegranteWhereInput
      $orderBy: IntegranteOrderByInput
      $skip: Int
      $after: String
      $before: String
      $first: Int
      $last: Int
    ) {
      integrantes(
        where: $where
        orderBy: $orderBy
        skip: $skip
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        id
        proyecto {
          id
          codigo
        }
        usuario {
          id
          firstname
          lastname
          fullname
          email
          username
          employeeNumber
          roles {
            id
            name
          }
        }
        jefeProyecto
        pagos {
          id
          integrante {
            id
            usuario {
              id
              fullname
              employeeNumber
            }
          }
          mes {
            id
            nombre
          }
          anno {
            id
            numero
          }
          horas
          presencia
          incidencia
          relevancia
          complejidad
          gestion
          vinculacion
          calidad
          significacion
          cumplimiento
          calculo
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class IntegranteGQL extends Apollo.Query<
  Integrante.Query,
  Integrante.Variables
> {
  document: any = gql`
    query integrante($id: String!) {
      integrante(id: $id) {
        id
        proyecto {
          id
          codigo
        }
        usuario {
          id
          firstname
          lastname
          fullname
          email
          username
          employeeNumber
          roles {
            id
            name
          }
        }
        jefeProyecto
        pagos {
          id
          integrante {
            id
            usuario {
              id
              fullname
              employeeNumber
            }
          }
          mes {
            id
            nombre
          }
          anno {
            id
            numero
          }
          horas
          presencia
          incidencia
          relevancia
          complejidad
          gestion
          vinculacion
          calidad
          significacion
          cumplimiento
          calculo
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class AnnosGQL extends Apollo.Query<Annos.Query, Annos.Variables> {
  document: any = gql`
    query annos(
      $where: AnnoWhereInput
      $orderBy: AnnoOrderByInput
      $skip: Int
      $after: String
      $before: String
      $first: Int
      $last: Int
    ) {
      annos(
        where: $where
        orderBy: $orderBy
        skip: $skip
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        id
        numero
        habilitado
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class MesesGQL extends Apollo.Query<Meses.Query, Meses.Variables> {
  document: any = gql`
    query meses(
      $where: MesWhereInput
      $orderBy: MesOrderByInput
      $skip: Int
      $after: String
      $before: String
      $first: Int
      $last: Int
    ) {
      meses(
        where: $where
        orderBy: $orderBy
        skip: $skip
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        id
        nombre
        habilitado
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class AlcanceGQL extends Apollo.Query<Alcance.Query, Alcance.Variables> {
  document: any = gql`
    query alcance($id: String!) {
      alcance(id: $id) {
        id
        nombre
        valor
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class AlcancesGQL extends Apollo.Query<
  Alcances.Query,
  Alcances.Variables
> {
  document: any = gql`
    query alcances {
      alcances {
        id
        nombre
        valor
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class AreaGQL extends Apollo.Query<Area.Query, Area.Variables> {
  document: any = gql`
    query area($id: String!) {
      area(id: $id) {
        id
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class AreasGQL extends Apollo.Query<Areas.Query, Areas.Variables> {
  document: any = gql`
    query areas {
      areas {
        id
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class EjeGQL extends Apollo.Query<Eje.Query, Eje.Variables> {
  document: any = gql`
    query eje($id: String!) {
      eje(id: $id) {
        id
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class EjesGQL extends Apollo.Query<Ejes.Query, Ejes.Variables> {
  document: any = gql`
    query ejes(
      $where: EjeWhereInput
      $orderBy: EjeOrderByInput
      $skip: Int
      $after: String
      $before: String
      $first: Int
      $last: Int
    ) {
      ejes(
        where: $where
        orderBy: $orderBy
        skip: $skip
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        id
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class LineaGQL extends Apollo.Query<Linea.Query, Linea.Variables> {
  document: any = gql`
    query linea($id: String!) {
      linea(id: $id) {
        id
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class LineasGQL extends Apollo.Query<Lineas.Query, Lineas.Variables> {
  document: any = gql`
    query lineas(
      $where: LineaWhereInput
      $orderBy: LineaOrderByInput
      $skip: Int
      $after: String
      $before: String
      $first: Int
      $last: Int
    ) {
      lineas(
        where: $where
        orderBy: $orderBy
        skip: $skip
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        id
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class TipoGQL extends Apollo.Query<Tipo.Query, Tipo.Variables> {
  document: any = gql`
    query tipo($id: String!) {
      tipo(id: $id) {
        id
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class TiposGQL extends Apollo.Query<Tipos.Query, Tipos.Variables> {
  document: any = gql`
    query tipos {
      tipos {
        id
        nombre
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class ProyectoGQL extends Apollo.Query<
  Proyecto.Query,
  Proyecto.Variables
> {
  document: any = gql`
    query proyecto($id: String!) {
      proyecto(id: $id) {
        id
        codigo
        nombre
        inicia
        finaliza
        area {
          id
          nombre
        }
        eje {
          id
          nombre
        }
        linea {
          id
          nombre
        }
        tipo {
          id
          nombre
        }
        alcance {
          id
          nombre
          valor
        }
        estado
        integrantes {
          id
          proyecto {
            id
            codigo
          }
          usuario {
            id
            firstname
            lastname
            fullname
            email
            username
            employeeNumber
            roles {
              id
              name
            }
          }
          jefeProyecto
          pagos {
            id
            integrante {
              id
              usuario {
                id
                fullname
                employeeNumber
              }
            }
            mes {
              id
              nombre
            }
            anno {
              id
              numero
            }
            horas
            presencia
            incidencia
            relevancia
            complejidad
            gestion
            vinculacion
            calidad
            significacion
            cumplimiento
            calculo
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class ProyectosGQL extends Apollo.Query<
  Proyectos.Query,
  Proyectos.Variables
> {
  document: any = gql`
    query proyectos(
      $where: ProyectoWhereInput
      $orderBy: ProyectoOrderByInput
      $skip: Int
      $after: String
      $before: String
      $first: Int
      $last: Int
    ) {
      proyectos(
        where: $where
        orderBy: $orderBy
        skip: $skip
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        id
        codigo
        nombre
        inicia
        finaliza
        alcance {
          id
          nombre
          valor
        }
        area {
          id
          nombre
        }
        eje {
          id
          nombre
        }
        linea {
          id
          nombre
        }
        tipo {
          id
          nombre
        }
        estado
        integrantes {
          id
          proyecto {
            id
            codigo
          }
          usuario {
            id
            firstname
            lastname
            fullname
            email
            username
            employeeNumber
            roles {
              id
              name
            }
          }
          jefeProyecto
          pagos {
            id
            integrante {
              id
              usuario {
                id
                fullname
                employeeNumber
              }
            }
            mes {
              id
              nombre
            }
            anno {
              id
              numero
            }
            horas
            presencia
            incidencia
            relevancia
            complejidad
            gestion
            vinculacion
            calidad
            significacion
            cumplimiento
            calculo
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class MeGQL extends Apollo.Query<Me.Query, Me.Variables> {
  document: any = gql`
    query me {
      me {
        id
        firstname
        lastname
        fullname
        email
        username
        employeeNumber
        roles {
          id
          name
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class UsersGQL extends Apollo.Query<Users.Query, Users.Variables> {
  document: any = gql`
    query users(
      $where: UserWhereInput
      $orderBy: UserOrderByInput
      $skip: Int
      $after: String
      $before: String
      $first: Int
      $last: Int
    ) {
      users(
        where: $where
        orderBy: $orderBy
        skip: $skip
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        id
        firstname
        lastname
        fullname
        email
        username
        employeeNumber
        roles {
          id
          name
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class FileGQL extends Apollo.Query<File.Query, File.Variables> {
  document: any = gql`
    query file($id: String!) {
      file(id: $id) {
        id
        filename
        path
        encoding
        mimetype
        size
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class FilesGQL extends Apollo.Query<Files.Query, Files.Variables> {
  document: any = gql`
    query files {
      files {
        id
        filename
        mimetype
        path
        size
      }
    }
  `;
}

// ====================================================
// END: Apollo Angular template
// ====================================================
